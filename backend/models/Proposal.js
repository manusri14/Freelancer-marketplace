const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.ObjectId,
    ref: 'Project',
    required: true
  },
  freelancer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  bidAmount: {
    type: Number,
    required: [true, 'Please add a bid amount']
  },
  coverLetter: {
    type: String,
    required: [true, 'Please add a cover letter']
  },
  deliveryTime: {
    type: String,
    required: [true, 'Please add estimated delivery time (e.g., 2 weeks)']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Proposal', proposalSchema);
