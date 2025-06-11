import mongoose from 'mongoose';
import User from '../models/User.js';
import Bookmark from '../models/Bookmark.js';

const connectionString = 'mongodb://localhost:27017/bookmarking-app';

async function assignBookmarks() {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to MongoDB');

    // Find skylabel user
    const skylabelUser = await User.findOne({ username: 'skylabel' });
    if (!skylabelUser) {
      throw new Error('User "skylabel" not found');
    }

    // Update all bookmarks to be owned by skylabel
    const result = await Bookmark.updateMany(
      {}, 
      { 
        $set: { 
          owner: skylabelUser._id,
          visibility: 'private'
        } 
      }
    );

    console.log(`Successfully assigned ${result.modifiedCount} bookmarks to user skylabel`);
    mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

assignBookmarks();