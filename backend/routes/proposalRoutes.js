const express = require('express');
const {
  getProposals,
  submitProposal,
  updateProposalStatus
} = require('../controllers/proposalController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(protect, getProposals)
  .post(protect, authorize('freelancer', 'admin'), submitProposal);

router.route('/:id/status')
  .put(protect, authorize('client', 'admin'), updateProposalStatus);

module.exports = router;
