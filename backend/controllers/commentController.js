const Comment = require('../models/Comment');

// @desc    Add comment to bug
// @route   POST /api/bugs/:bugId/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    
    const comment = await Comment.create({
      bug: req.params.bugId,
      user: req.user.id,
      text
    });

    const populatedComment = await Comment.findById(comment._id).populate('user', 'name');

    res.status(201).json({
      success: true,
      data: populatedComment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get comments for bug
// @route   GET /api/bugs/:bugId/comments
// @access  Private
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ bug: req.params.bugId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: comments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  addComment,
  getComments
};
