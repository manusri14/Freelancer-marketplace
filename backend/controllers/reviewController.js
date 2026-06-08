const Review = require('../models/Review');
const Project = require('../models/Project');

// @desc    Get reviews for a freelancer
// @route   GET /api/reviews/freelancer/:freelancerId
// @access  Public
const getFreelancerReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ freelancer: req.params.freelancerId })
      .populate('client', 'name avatar')
      .populate('project', 'title');

    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add review
// @route   POST /api/reviews
// @access  Private (Client only)
const addReview = async (req, res) => {
  try {
    req.body.client = req.user.id;

    const project = await Project.findById(req.body.project);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.client.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Only the project client can leave a review' });
    }

    if (project.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Project must be completed to leave a review' });
    }

    const review = await Review.create(req.body);

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getFreelancerReviews,
  addReview
};
