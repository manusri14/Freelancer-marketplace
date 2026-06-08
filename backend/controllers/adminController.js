const User = require('../models/User');
const Project = require('../models/Project');
const Proposal = require('../models/Proposal');
const Review = require('../models/Review');

// @desc    Get platform analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin only)
const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalClients = await User.countDocuments({ role: 'client' });
    const totalFreelancers = await User.countDocuments({ role: 'freelancer' });
    
    const totalProjects = await Project.countDocuments();
    const activeProjects = await Project.countDocuments({ status: { $in: ['open', 'in-progress'] } });
    const completedProjects = await Project.countDocuments({ status: 'completed' });

    const totalProposals = await Proposal.countDocuments();
    const totalReviews = await Review.countDocuments();

    // Calculate total project budgets (as a proxy for platform volume)
    const projects = await Project.find();
    const totalBudgetVolume = projects.reduce((acc, curr) => acc + curr.budget, 0);

    res.status(200).json({
      success: true,
      data: {
        users: { total: totalUsers, clients: totalClients, freelancers: totalFreelancers },
        projects: { total: totalProjects, active: activeProjects, completed: completedProjects },
        proposals: totalProposals,
        reviews: totalReviews,
        totalBudgetVolume
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Optional: Delete all projects/proposals associated with the user
    await Project.deleteMany({ client: user._id });
    await Proposal.deleteMany({ freelancer: user._id });
    
    await user.deleteOne();
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAnalytics,
  getUsers,
  deleteUser
};
