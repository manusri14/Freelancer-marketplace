const express = require('express');
const {
  generateDescription,
  generateProposal
} = require('../controllers/aiController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/generate-description', protect, authorize('client', 'admin'), generateDescription);
router.post('/generate-proposal', protect, authorize('freelancer', 'admin'), generateProposal);

module.exports = router;
