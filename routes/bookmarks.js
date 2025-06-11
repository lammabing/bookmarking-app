import express from 'express';
import Bookmark from '../models/Bookmark.js';
import { auth } from '../middleware/auth.js';
import jwt from 'jsonwebtoken'; // Add missing import

const router = express.Router();

// @route   GET /api/bookmarks
// @desc    Get all bookmarks (filtered by visibility and ownership)
// @access  Public/Private
router.get('/', async (req, res) => {
  try {
    let query = { visibility: 'public' };
    
    // If user is authenticated, include their private bookmarks and bookmarks shared with them
    if (req.headers['x-auth-token']) {
      try {
        const token = req.headers['x-auth-token'];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        
        query = {
          $or: [
            { visibility: 'public' },
            { owner: userId },
            { visibility: 'selected', sharedWith: userId }
          ]
        };
      } catch (err) {
        console.error('Token verification failed:', err.message);
        // Fall back to public-only query
      }
    }
    
    const bookmarks = await Bookmark.find(query)
      .populate('owner', 'username')
      .sort({ createdAt: -1 });
      
    res.json(bookmarks);
  } catch (err) {
    console.error('Error fetching bookmarks:', err);
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/bookmarks/:id
// @desc    Get a single bookmark
// @access  Public/Private (depending on bookmark visibility)
router.get('/:id', async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id)
      .populate('owner', 'username');
      
    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }
    
    // Check if user can access this bookmark
    let canAccess = bookmark.visibility === 'public';
    
    if (req.headers['x-auth-token'] && !canAccess) {
      try {
        const decoded = jwt.verify(req.headers['x-auth-token'], process.env.JWT_SECRET);
        const userId = decoded.id;
        
        canAccess = bookmark.owner.toString() === userId ||
                   (bookmark.visibility === 'selected' && 
                    bookmark.sharedWith.some(id => id.toString() === userId));
      } catch (err) {
        // Invalid token, fall back to public-only access
      }
    }
    
    if (!canAccess) {
      return res.status(403).json({ message: 'Not authorized to view this bookmark' });
    }
    
    res.json(bookmark);
  } catch (err) {
    console.error('Error fetching bookmark:', err);
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/bookmarks
// @desc    Create a new bookmark
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const bookmarkData = Array.isArray(req.body) ? req.body : [req.body];
    
    const savedBookmarks = await Promise.all(
      bookmarkData.map(async (data) => {
        const bookmark = new Bookmark({
          ...data,
          owner: req.user.id,
          visibility: data.visibility || 'private'
        });
        return await bookmark.save();
      })
    );
    
    res.status(201).json(Array.isArray(req.body) ? savedBookmarks : savedBookmarks[0]);
  } catch (err) {
    console.error('Error creating bookmark:', err);
    res.status(400).json({ message: err.message });
  }
});

// @route   PUT /api/bookmarks/:id
// @desc    Update a bookmark
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);
    
    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }
    
    // Check if user owns this bookmark
    if (bookmark.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this bookmark' });
    }
    
    const updatedBookmark = await Bookmark.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    res.json(updatedBookmark);
  } catch (err) {
    console.error('Error updating bookmark:', err);
    res.status(500).json({ message: err.message });
  }
});

// @route   DELETE /api/bookmarks/:id
// @desc    Delete a bookmark
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);
    
    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }
    
    // Check if user owns this bookmark
    if (bookmark.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this bookmark' });
    }
    
    await Bookmark.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Bookmark deleted successfully' });
  } catch (err) {
    console.error('Error deleting bookmark:', err);
    res.status(500).json({ message: err.message });
  }
});

// @route   PUT /api/bookmarks/:id/share
// @desc    Update bookmark sharing settings
// @access  Private
router.put('/:id/share', auth, async (req, res) => {
  try {
    const { visibility, sharedWith } = req.body;
    
    // Validate request body
    if (!visibility || !['private', 'public', 'selected'].includes(visibility)) {
      return res.status(400).json({ message: 'Invalid visibility value' });
    }
    
    if (visibility === 'selected' && (!sharedWith || !Array.isArray(sharedWith))) {
      return res.status(400).json({ message: 'sharedWith array is required for selected visibility' });
    }
    
    const bookmark = await Bookmark.findById(req.params.id);
    
    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }
    
    // Check if user owns this bookmark
    if (bookmark.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update sharing settings' });
    }
    
    // Update bookmark sharing settings
    bookmark.visibility = visibility;
    bookmark.sharedWith = visibility === 'selected' ? [...new Set(sharedWith)] : [];
    bookmark.updatedAt = new Date();
    
    await bookmark.save();
    
    // TODO: Implement notification sending
    // await sendSharingNotification(bookmark);
    
    res.json({
      message: 'Sharing settings updated successfully',
      bookmark: {
        _id: bookmark._id,
        visibility: bookmark.visibility,
        sharedWith: bookmark.sharedWith
      }
    });
  } catch (err) {
    console.error('Error updating sharing settings:', err);
    res.status(500).json({ message: err.message });
  }
});

export default router;