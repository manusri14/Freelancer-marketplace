const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title can not be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [5000, 'Description can not be more than 5000 characters']
  },
  budget: {
    type: Number,
    required: [true, 'Please add a budget']
  },
  deadline: {
    type: Date,
    required: [true, 'Please add a deadline']
  },
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  requiredSkills: {
    type: [String],
    required: [true, 'Please add required skills']
  },
  client: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'completed', 'cancelled'],
    default: 'open'
  },
  hiredFreelancer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
