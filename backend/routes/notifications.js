const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead
} = require('../controllers/notificationController');

const router = express.Router();

// All routes need auth
router.use(protect);

// Get all notifications for admin
router.get('/', getNotifications);

// Get unread count
router.get('/unread/count', getUnreadCount);

// Mark specific notification as read
router.put('/:id/read', markAsRead);

// Mark all as read
router.put('/mark-all/read', markAllAsRead);

module.exports = router;
