const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  bug: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bug',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: [true, 'Please add comment text'],
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
