import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Bookmark from '../models/Bookmark.js';
import crypto from 'crypto';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const migrateBookmarks = async () => {
  try {
    // Check if system user exists, create if not
    let systemUser = await User.findOne({ username: 'system' });
    
    if (!systemUser) {
      console.log('Creating system user...');
      systemUser = new User({
        username: 'system',
        email: 'system@bookmarkapp.com',
        password: crypto.randomBytes(16).toString('hex'),
      });
      await systemUser.save();
      console.log('System user created');
    }
    
    // Find all bookmarks without an owner
    const bookmarksToMigrate = await mongoose.connection.collection('bookmarks').find({
      owner: { $exists: false }
    }).toArray();
    
    console.log(`Found ${bookmarksToMigrate.length} bookmarks to migrate`);
    
    if (bookmarksToMigrate.length === 0) {
      console.log('No bookmarks to migrate');
      process.exit(0);
    }
    
    // Update each bookmark
    for (const bookmark of bookmarksToMigrate) {
      console.log(`Migrating bookmark: ${bookmark.title}`);
      
      await mongoose.connection.collection('bookmarks').updateOne(
        { _id: bookmark._id },
        { 
          $set: { 
            owner: systemUser._id,
            visibility: 'private',
            updatedAt: new Date()
          } 
        }
      );
    }
    
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateBookmarks();
