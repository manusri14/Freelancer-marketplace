const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Include other resource routers
const proposalRouter = require('./proposalRoutes');

const router = express.Router();

// Re-route into other resource routers
router.use('/:projectId/proposals', proposalRouter);

router.route('/')
  .get(getProjects)
  .post(protect, authorize('client', 'admin'), createProject);

router.route('/:id')
  .get(getProject)
  .put(protect, authorize('client', 'admin'), updateProject)
  .delete(protect, authorize('client', 'admin'), deleteProject);

module.exports = router;
