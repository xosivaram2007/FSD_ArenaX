const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sportType: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

const Tournament = mongoose.model('Tournament', tournamentSchema);
module.exports = Tournament;
