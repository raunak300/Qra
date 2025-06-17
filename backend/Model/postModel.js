const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  email: {
    type: mongoose.Schema.Types.String, // Email ko string type me store karega
    required: true,
    ref: "User",
  },
  userName: {
    type: String, // User ka naam store karega
    required: true, // User name required hai
    trim: true, // Leading/trailing spaces remove karein
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, // User ke ID ko store karega
    ref: 'User', // Assume User model ka naam 'User' hai
    required: true,
  },
  title: { // Naya field add kiya gaya hai
    type: String,
    required: false, // Title optional ho sakta hai
    trim: true, // Leading/trailing spaces remove karein
  },
  textContent: {
    type: String,
    required: false, // Text content optional ho sakta hai
  },
  imagePath: {
    type: String, // Image ka path store karega, jo server pe upload hoga
    required: false, // Image optional ho sakti hai
  },
  Likes: {
    type: Number,
    default: 0
  },
  LikedBy:{
    type : [mongoose.Schema.Types.ObjectId]
  },
  createdAt: {
    type: Date,
    default: Date.now, // Jis din post create hua, woh timestamp
  },
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
