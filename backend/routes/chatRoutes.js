const express = require('express');
const {
  getChatHistory,
  sendMessage,
  markAsRead
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/:userId')
  .get(getChatHistory)
  .post(sendMessage);

router.route('/:userId/read')
  .put(markAsRead);

module.exports = router;
