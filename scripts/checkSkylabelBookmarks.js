import mongoose from 'mongoose';
import User from '../models/User.js';
import Bookmark from '../models/Bookmark.js';

const connectionString = 'mongodb://localhost:27017/bookmarking-app';

async function checkBookmarks() {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to MongoDB');

    // Find skylabel user
    const skylabelUser = await User.findOne({ username: 'skylabel' });
    if (!skylabelUser) {
      throw new Error('User "skylabel" not found');
    }

    // Count bookmarks using the same query as the API endpoint
    const query = {
      $or: [
        { visibility: 'public' },
        { owner: skylabelUser._id },
        { visibility: 'selected', sharedWith: skylabelUser._id }
      ]
    };
    
    const count = await Bookmark.countDocuments(query);
    console.log(`API query returns ${count} bookmarks for user 'skylabel'`);

    mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkBookmarks();