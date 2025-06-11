import mongoose from 'mongoose';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const connectionString = 'mongodb://localhost:27017/bookmarking-app';
const newPassword = 'pass1234';

async function resetPasswords() {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to MongoDB');

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update passwords for specific users
    const usernames = ['system', 'skylabel'];
    const result = await User.updateMany(
      { username: { $in: usernames } },
      { $set: { password: hashedPassword } }
    );

    console.log(`Successfully updated ${result.modifiedCount} user passwords`);
    mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

resetPasswords();