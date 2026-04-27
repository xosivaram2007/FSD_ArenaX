const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    required: true,
  },
  teamA: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  teamB: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  scoreA: {
    type: Number,
    default: 0,
  },
  scoreB: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Ongoing', 'Completed'],
    default: 'Scheduled',
  },
  date: {
    type: Date,
  },
}, { timestamps: true });

const Match = mongoose.model('Match', matchSchema);
module.exports = Match;
