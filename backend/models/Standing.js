const mongoose = require('mongoose');

const standingSchema = new mongoose.Schema({
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    required: true,
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  wins: {
    type: Number,
    default: 0,
  },
  losses: {
    type: Number,
    default: 0,
  },
  draws: {
    type: Number,
    default: 0,
  },
  points: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

const Standing = mongoose.model('Standing', standingSchema);
module.exports = Standing;
