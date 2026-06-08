const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  freelancer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  project: {
    type: mongoose.Schema.ObjectId,
    ref: 'Project',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating between 1 and 5'],
    min: 1,
    max: 5
  },
  review: {
    type: String,
    required: [true, 'Please add a review text']
  }
}, {
  timestamps: true
});

// Prevent user from submitting more than one review per project
reviewSchema.index({ project: 1, client: 1, freelancer: 1 }, { unique: true });

// Static method to get avg rating and save
reviewSchema.statics.getAverageRating = async function(freelancerId) {
  const obj = await this.aggregate([
    {
      $match: { freelancer: freelancerId }
    },
    {
      $group: {
        _id: '$freelancer',
        averageRating: { $avg: '$rating' },
        numReviews: { $sum: 1 }
      }
    }
  ]);

  try {
    await this.model('User').findByIdAndUpdate(freelancerId, {
      rating: obj[0] ? Math.round(obj[0].averageRating * 10) / 10 : 0,
      numReviews: obj[0] ? obj[0].numReviews : 0
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
reviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.freelancer);
});

// Call getAverageRating before remove
reviewSchema.pre('deleteOne', { document: true, query: false }, function() {
  this.constructor.getAverageRating(this.freelancer);
});

module.exports = mongoose.model('Review', reviewSchema);
