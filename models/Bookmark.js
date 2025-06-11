import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema({
  url: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  tags: [String],
  favicon: { type: String },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  visibility: { 
    type: String, 
    enum: ['private', 'selected', 'public'], 
    default: 'private' 
  },
  sharedWith: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt timestamp before saving
bookmarkSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

export default Bookmark;