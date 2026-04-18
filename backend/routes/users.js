const express = require('express');
const { protect } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { getUsers, getUser } = require('../controllers/userController');

const router = express.Router({ mergeParams: true });

// All routes need auth and admin role
router.use(protect);
router.use(roleCheck(['admin']));

router.route('/').get(getUsers);
router.route('/:id').get(getUser);

module.exports = router;
