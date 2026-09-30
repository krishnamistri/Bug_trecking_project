const Bug = require('../models/Bug');
const Comment = require('../models/Comment');
const { createNotification } = require('./notificationController');

// @desc    Get all bugs
// @route   GET /api/bugs
// @access  Private
const getBugs = async (req, res) => {
  try {
    let query;

    // Admin can see all, others see their own/assigned
    if (req.user.role === 'admin') {
      query = Bug.find().populate('assignedTo', 'name email').populate('createdBy', 'name email');
    } else if (req.user.role === 'tester') {
      query = Bug.find({ createdBy: req.user.id }).populate('assignedTo', 'name email');
    } else {
      // developer
      query = Bug.find({ assignedTo: req.user.id }).populate('createdBy', 'name email');
    }

    const bugs = await query.sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bugs.length,
      data: bugs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single bug
// @route   GET /api/bugs/:id
// @access  Private
const getBug = async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id)
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email role');

    if (!bug) {
      return res.status(404).json({
        success: false,
        message: 'Bug not found'
      });
    }

    // Check permissions
    const isAdmin = req.user.role === 'admin';
    const isOwner = bug.createdBy._id.toString() === req.user.id;
    const isAssigned = bug.assignedTo && bug.assignedTo._id.toString() === req.user.id;

    if (!isAdmin && !isOwner && !isAssigned) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this bug'
      });
    }

    res.json({
      success: true,
      data: bug
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create bug (Tester only)
// @route   POST /api/bugs
// @access  Private/Tester
const createBug = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    
    if (req.file) {
      req.body.screenshot = `/uploads/${req.file.filename}`;
    }
    
    const bug = await Bug.create(req.body);

    // Create notification for admin
    await createNotification('bug_created', bug, req.user.id);

    res.status(201).json({
      success: true,
      data: bug
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// @desc    Update bug (Admin/Developer/Tester)
// @route   PUT /api/bugs/:id
// @access  Private
const updateBug = async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);

    if (!bug) {
      return res.status(404).json({
        success: false,
        message: 'Bug not found'
      });
    }

    // Permission checks
    const isAdmin = req.user.role === 'admin';
    const isTesterOwner = req.user.role === 'tester' && bug.createdBy._id.toString() === req.user.id;
    const isDeveloperAssigned = req.user.role === 'developer' && bug.assignedTo && bug.assignedTo._id.toString() === req.user.id;

    // Check if trying to close/verify bug - only tester (owner) can do this
    if (req.body.status === 'verified') {
      if (!isAdmin && !isTesterOwner) {
        return res.status(403).json({
          success: false,
          message: 'Only testers can close/verify bugs'
        });
      }
    } else {
      // For other status updates
      if (!isAdmin && !isTesterOwner && !isDeveloperAssigned) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this bug'
        });
      }
    }

    const updatedBug = await Bug.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('assignedTo', 'name email').populate('createdBy', 'name email');

    res.json({
      success: true,
      data: updatedBug
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete bug (Admin only)
// @route   DELETE /api/bugs/:id
// @access  Private/Admin
const deleteBug = async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);

    if (!bug) {
      return res.status(404).json({
        success: false,
        message: 'Bug not found'
      });
    }

    // Check permissions: dev own solved or admin
    const isAdmin = req.user.role === 'admin';
    const isDevOwnerSolved = req.user.role === 'developer' && bug.assignedTo && bug.assignedTo._id.toString() === req.user.id && (bug.status === 'in-progress' || bug.status === 'fixed' || bug.status === 'verified');

    if (!isAdmin && !isDevOwnerSolved) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this bug'
      });
    }

    await Bug.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Bug removed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getBugs,
  getBug,
  createBug,
  updateBug,
  deleteBug
};
