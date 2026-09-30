const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['bug_created', 'bug_assigned', 'bug_fixed', 'bug_verified'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  recipientRole: {
    type: String,
    enum: ['admin', 'tester', 'developer', 'all'],
    default: 'admin'
  },
  bugId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bug',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
