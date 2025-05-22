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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
