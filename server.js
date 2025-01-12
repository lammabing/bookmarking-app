import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://host.docker.internal:27017/bookmarking-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () =>
{
    console.log('Connected to MongoDB');
});

// Define Bookmark Schema
const bookmarkSchema = new mongoose.Schema({
    url: String,
    title: String,
    description: String,
    tags: [String],
    favicon: String,
});

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

// API Endpoints
app.get('/api/bookmarks', async (req, res) =>
{
    try {
        const bookmarks = await Bookmark.find();
        res.json(bookmarks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Bookmarklet endpoint
app.get('/add', async (req, res) =>
{
    const { url, title, description, favicon } = req.query;

    if (!url) {
        return res.status(400).json({ message: 'URL is required' });
    }

    try {
        const newBookmark = new Bookmark({
            url,
            title: title || 'Untitled',
            description: description || '',
            tags: [],
            favicon: favicon || `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}`,
        });

        const savedBookmark = await newBookmark.save();

        // Redirect based on environment
        if (process.env.NODE_ENV === 'production') {
            res.redirect('/?bookmarkAdded=true&id=${savedBookmark._id}');
        } else {
            // In development, redirect to the Vite dev server
            res.redirect(`http://localhost:5170/?bookmarkAdded=true&id=${savedBookmark._id}`);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/bookmarks', async (req, res) =>
{
    const bookmark = new Bookmark(req.body);
    try {
        const savedBookmark = await bookmark.save();
        res.status(201).json(savedBookmark);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/api/bookmarks/:id', async (req, res) =>
{
    try {
        await Bookmark.findByIdAndDelete(req.params.id);
        res.json({ message: 'Bookmark deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add this endpoint to server.js
app.put('/api/bookmarks/:id', async (req, res) =>
{
    try {
        const updatedBookmark = await Bookmark.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedBookmark);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));

    // Handle all other routes by serving the frontend's index.html
    app.get('*', (req, res) =>
    {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
}

// Start Server
app.listen(PORT, () =>
{
    console.log(`Server running on http://localhost:${PORT}`);
});
