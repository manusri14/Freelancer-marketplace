const Proposal = require('../models/Proposal');
const Project = require('../models/Project');

// @desc    Get all proposals for a project
// @route   GET /api/projects/:projectId/proposals
// @access  Private
const getProposals = async (req, res) => {
  try {
    if (req.params.projectId) {
      const proposals = await Proposal.find({ project: req.params.projectId }).populate({
        path: 'freelancer',
        select: 'name avatar rating numReviews skills'
      });
      return res.status(200).json({ success: true, count: proposals.length, data: proposals });
    } else {
      // Get all proposals for logged in freelancer
      const proposals = await Proposal.find({ freelancer: req.user.id }).populate({
        path: 'project',
        select: 'title budget deadline status client'
      });
      return res.status(200).json({ success: true, count: proposals.length, data: proposals });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit a proposal
// @route   POST /api/projects/:projectId/proposals
// @access  Private (Freelancer only)
const submitProposal = async (req, res) => {
  try {
    req.body.project = req.params.projectId;
    req.body.freelancer = req.user.id;

    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check if user already submitted a proposal
    const existingProposal = await Proposal.findOne({ project: req.params.projectId, freelancer: req.user.id });
    if (existingProposal) {
      return res.status(400).json({ success: false, message: 'You have already submitted a proposal for this project' });
    }

    const proposal = await Proposal.create(req.body);

    res.status(201).json({ success: true, data: proposal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update proposal status
// @route   PUT /api/proposals/:id/status
// @access  Private (Client only)
const updateProposalStatus = async (req, res) => {
  try {
    const { status } = req.body; // accepted, rejected

    let proposal = await Proposal.findById(req.params.id).populate('project');

    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }

    // Make sure user is project client
    if (proposal.project.client.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'User not authorized to update this proposal' });
    }

    proposal.status = status;
    await proposal.save();

    // If accepted, update project status to 'in-progress' and set hiredFreelancer
    if (status === 'accepted') {
      const project = await Project.findById(proposal.project._id);
      project.status = 'in-progress';
      project.hiredFreelancer = proposal.freelancer;
      await project.save();
    }

    res.status(200).json({ success: true, data: proposal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProposals,
  submitProposal,
  updateProposalStatus
};
