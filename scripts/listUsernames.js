import mongoose from 'mongoose';
import User from '../models/User.js';

const connectionString = 'mongodb://localhost:27017/bookmarking-app'; // Using provided connection string with database name

async function listUsernames() {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to MongoDB');

    const users = await User.find({}, 'username email');
    console.log('Users:');
    users.forEach(user => console.log(`Username: ${user.username}, Email: ${user.email}`));

    mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

listUsernames();