const express = require('express');
const {
  getFreelancerReviews,
  addReview
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/freelancer/:freelancerId', getFreelancerReviews);
router.post('/', protect, authorize('client'), addReview);

module.exports = router;
