const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @desc    Get all freelancers
// @route   GET /api/users/freelancers
// @access  Public or Client/Admin
router.get('/freelancers', async (req, res) => {
  try {
    const keyword = req.query.keyword ? {
      $or: [
        { name: { $regex: req.query.keyword, $options: 'i' } },
        { skills: { $regex: req.query.keyword, $options: 'i' } }
      ]
    } : {};

    const freelancers = await User.find({ role: 'freelancer', ...keyword }).select('-password');
    res.status(200).json({ success: true, data: freelancers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const upload = require('../middleware/uploadMiddleware');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, bio, skills } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (skills) user.skills = skills;
    
    await user.save();
    
    // We send back the updated user but omit the password
    const updatedUser = await User.findById(req.user.id).select('-password');
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Upload avatar
// @route   POST /api/users/avatar
// @access  Private
router.post('/avatar', protect, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Upload to Cloudinary using stream
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'freelancer_avatars', width: 250, height: 250, crop: 'fill' },
      async (error, result) => {
        if (error) return res.status(500).json({ success: false, message: error.message });

        // Update user avatar URL
        user.avatar = result.secure_url;
        await user.save();

        const updatedUser = await User.findById(req.user.id).select('-password');
        res.status(200).json({ success: true, data: updatedUser });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
