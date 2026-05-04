const mongoose = require('mongoose');

const readingSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // Story/passage that was read
    storyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Story',
      default: null,
    },
    storyTitle: {
      type: String,
      default: '',
    },

    // Core reading metrics
    wpm: {
      type: Number,
      required: true,
      min: 0,
    },
    comprehensionPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    // Session duration in seconds
    durationSeconds: {
      type: Number,
      default: null,
    },

    // Word count of the passage read
    wordCount: {
      type: Number,
      default: null,
    },

    completedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt
  }
);

// Compound index for fast per-student queries (used in teacher dashboard)
readingSessionSchema.index({ userId: 1, completedAt: -1 });

module.exports = mongoose.model('ReadingSession', readingSessionSchema);