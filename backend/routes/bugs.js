const express = require('express');
const { protect } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const {
  getBugs,
  getBug,
  createBug,
  updateBug,
  deleteBug
} = require('../controllers/bugController');

const router = express.Router({ mergeParams: true });

// All routes need auth
router.use(protect);

// All users can GET bugs
router.route('/').get(getBugs);

// Testers can create bugs
router.post('/', roleCheck(['tester']), createBug);

// All protected routes
router
  .route('/:id')
  .get(getBug)
  .put(updateBug)
  .delete(deleteBug);

module.exports = router;
