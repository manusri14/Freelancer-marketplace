const express = require('express');
const {
  getAnalytics,
  getUsers,
  deleteUser
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/analytics', getAnalytics);
router.route('/users')
  .get(getUsers);
router.route('/users/:id')
  .delete(deleteUser);

module.exports = router;
