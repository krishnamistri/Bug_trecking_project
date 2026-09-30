const Notification = require('../models/Notification');

// @desc    Get all notifications for current user (admin only)
// @route   GET /api/notifications
// @access  Private/Admin
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [
        { recipientRole: 'admin' },
        { recipientRole: 'all' }
      ]
    })
      .populate('bugId', 'title priority status')
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get unread notifications count
// @route   GET /api/notifications/unread/count
// @access  Private/Admin
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      $or: [
        { recipientRole: 'admin' },
        { recipientRole: 'all' }
      ],
      isRead: false
    });

    res.json({
      success: true,
      unreadCount: count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private/Admin
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      {
        isRead: true,
        readAt: new Date()
      },
      { new: true }
    ).populate('bugId', 'title priority').populate('createdBy', 'name');

    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/mark-all/read
// @access  Private/Admin
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        $or: [
          { recipientRole: 'admin' },
          { recipientRole: 'all' }
        ],
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create notification (Internal use)
const createNotification = async (type, bugData, createdByUser) => {
  try {
    const notificationMessages = {
      bug_created: `New bug created: "${bugData.title}" (${bugData.priority} priority)`,
      bug_assigned: `Bug assigned: "${bugData.title}"`,
      bug_fixed: `Bug marked as fixed: "${bugData.title}"`,
      bug_verified: `Bug verified/closed: "${bugData.title}"`
    };

    const notification = await Notification.create({
      type,
      title: `Bug ${type.split('_')[1]}`,
      message: notificationMessages[type],
      recipientRole: 'admin',
      bugId: bugData._id,
      createdBy: createdByUser
    });

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  createNotification
};
