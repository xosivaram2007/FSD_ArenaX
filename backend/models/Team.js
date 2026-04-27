const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  players: [{
    name: { type: String, required: true },
    role: { type: String, enum: ['Player', 'Coach'], default: 'Player' },
    _id: false
  }],
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    required: true,
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

const Team = mongoose.model('Team', teamSchema);
module.exports = Team;
