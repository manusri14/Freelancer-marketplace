const Message = require('../models/Message');

// @desc    Get chat history between two users
// @route   GET /api/chat/:userId
// @access  Private
const getChatHistory = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user.id }
      ]
    }).sort('createdAt');

    res.status(200).json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send a message
// @route   POST /api/chat/:userId
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const message = await Message.create({
      sender: req.user.id,
      receiver: req.params.userId,
      message: req.body.message
    });

    // Populate sender info before returning
    await message.populate('sender', 'name avatar');

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark messages as read
// @route   PUT /api/chat/:userId/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    await Message.updateMany(
      { sender: req.params.userId, receiver: req.user.id, readStatus: false },
      { $set: { readStatus: true } }
    );
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getChatHistory,
  sendMessage,
  markAsRead
};
