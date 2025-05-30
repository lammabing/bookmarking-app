import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 5015;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

// Bookmark Schema
const bookmarkSchema = new mongoose.Schema({
    url: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    tags: [String],
    favicon: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt timestamp before saving
bookmarkSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

// API Routes

// GET all bookmarks
app.get('/api/bookmarks', async (req, res) => {
    try {
        const bookmarks = await Bookmark.find().sort({ createdAt: -1 });
        res.json(bookmarks);
    } catch (err) {
        console.error('Error fetching bookmarks:', err);
        res.status(500).json({ message: err.message });
    }
});

// GET single bookmark
app.get('/api/bookmarks/:id', async (req, res) => {
    try {
        const bookmark = await Bookmark.findById(req.params.id);
        if (!bookmark) {
            return res.status(404).json({ message: 'Bookmark not found' });
        }
        res.json(bookmark);
    } catch (err) {
        console.error('Error fetching bookmark:', err);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid Bookmark ID format' });
        }
        res.status(500).json({ message: err.message });
    }
});

// POST new bookmark(s)
app.post('/api/bookmarks', async (req, res) => {
    try {
        // Handle both single bookmark and array of bookmarks
        const data = Array.isArray(req.body) ? req.body : [req.body];
        const savedBookmarks = await Promise.all(
            data.map(async (bookmarkData) => {
                const bookmark = new Bookmark(bookmarkData);
                return await bookmark.save();
            })
        );
        
        // Return appropriate response based on input
        res.status(201).json(Array.isArray(req.body) ? savedBookmarks : savedBookmarks[0]);
    } catch (err) {
        console.error('Error creating bookmark:', err);
        res.status(400).json({ message: err.message });
    }
});

// PUT update bookmark
app.put('/api/bookmarks/:id', async (req, res) => {
    try {
        const bookmarkId = req.params.id;
        const updateData = {
            ...req.body,
            updatedAt: new Date()
        };
        
        const updatedBookmark = await Bookmark.findByIdAndUpdate(
            bookmarkId,
            updateData,
            { 
                new: true, // Return the updated document
                runValidators: true // Run model validators
            }
        );

        if (!updatedBookmark) {
            return res.status(404).json({ message: 'Bookmark not found' });
        }

        res.json(updatedBookmark);
    } catch (err) {
        console.error('Error updating bookmark:', err);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid Bookmark ID format' });
        }
        res.status(500).json({ message: err.message });
    }
});

// DELETE bookmark
app.delete('/api/bookmarks/:id', async (req, res) => {
    try {
        const bookmark = await Bookmark.findByIdAndDelete(req.params.id);
        if (!bookmark) {
            return res.status(404).json({ message: 'Bookmark not found' });
        }
        res.json({ message: 'Bookmark deleted successfully' });
    } catch (err) {
        console.error('Error deleting bookmark:', err);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid Bookmark ID format' });
        }
        res.status(500).json({ message: err.message });
    }
});

// TAG MANAGEMENT ROUTES

// GET all unique tags and their counts
app.get('/api/tags', async (req, res) => {
    try {
        const tags = await Bookmark.aggregate([
            { $unwind: '$tags' },
            { $group: { _id: '$tags', count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
            { $project: { name: '$_id', count: 1, _id: 0 } }
        ]);
        res.json(tags);
    } catch (err) {
        console.error('Error fetching tags:', err);
        res.status(500).json({ message: err.message });
    }
});

// PUT rename a tag
app.put('/api/tags/:oldName', async (req, res) => {
    const { oldName } = req.params;
    const { newName } = req.body;

    if (!newName || newName.trim() === '') {
        return res.status(400).json({ message: 'New tag name is required and cannot be empty.' });
    }
    if (oldName === newName) {
        return res.status(400).json({ message: 'Old and new tag names cannot be the same.' });
    }

    try {
        const bookmarksToUpdate = await Bookmark.find({ tags: oldName });
        let updatedCount = 0;

        if (bookmarksToUpdate.length === 0) {
            return res.json({ message: `Tag '${oldName}' not found on any bookmarks. No changes made.` });
        }

        for (const bookmark of bookmarksToUpdate) {
            const oldTagIndex = bookmark.tags.indexOf(oldName);
            if (oldTagIndex > -1) {
                bookmark.tags.splice(oldTagIndex, 1); // Remove old tag
            }
            if (!bookmark.tags.includes(newName)) { // Add new tag if not already present
                bookmark.tags.push(newName);
            }
            bookmark.updatedAt = new Date();
            await bookmark.save();
            updatedCount++;
        }
        
        res.json({ message: `Tag '${oldName}' successfully renamed to '${newName}' on ${updatedCount} bookmarks.` });

    } catch (err) {
        console.error(`Error renaming tag '${oldName}' to '${newName}':`, err);
        res.status(500).json({ message: `Error renaming tag: ${err.message}` });
    }
});

// DELETE a tag from all bookmarks
app.delete('/api/tags/:tagName', async (req, res) => {
    const { tagName } = req.params;
    try {
        const result = await Bookmark.updateMany(
            { tags: tagName },
            {
                $pull: { tags: tagName },
                $set: { updatedAt: new Date() }
            }
        );
        
        if (result.modifiedCount === 0) {
            // This means the tag was not found on any bookmarks, which is not an error.
            // The desired state (tag is not present) is achieved or was already true.
            return res.json({ message: `Tag '${tagName}' not found on any bookmarks or already removed. No changes made.` });
        }
        
        res.json({ message: `Tag '${tagName}' successfully removed from ${result.modifiedCount} bookmarks.` });
    } catch (err) {
        console.error(`Error deleting tag '${tagName}':`, err);
        res.status(500).json({ message: `Error deleting tag: ${err.message}` });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
