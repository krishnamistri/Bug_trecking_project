const express = require('express');
const { protect } = require('../middleware/auth');
const { addComment, getComments } = require('../controllers/commentController');

const router = express.Router({ mergeParams: true });

// All routes need auth
router.use(protect);

router.route('/').get(getComments).post(addComment);

module.exports = router;
