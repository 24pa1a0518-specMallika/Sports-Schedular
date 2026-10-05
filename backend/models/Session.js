const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  sport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sport',
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  players: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  additionalPlayersRequired: {
    type: Number,
    required: true,
    min: 0,
  },
  date: {
    type: String,
    required: true, // YYYY-MM-DD format
  },
  time: {
    type: String,
    required: true, // e.g. "18:00" or "06:00 PM"
  },
  venue: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['upcoming', 'completed', 'cancelled'],
    default: 'upcoming',
  },
  cancellationReason: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Session', sessionSchema);
