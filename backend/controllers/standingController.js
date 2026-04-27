const Standing = require('../models/Standing');

// @desc    Get leaderboard for a tournament
// @route   GET /api/standings/tournament/:tournamentId
// @access  Public
const getStandingsByTournament = async (req, res) => {
  try {
    const standings = await Standing.find({ tournamentId: req.params.tournamentId })
      .populate('teamId', 'name')
      .sort({ points: -1, wins: -1 }); // Sort by points descending, then wins
      
    res.status(200).json(standings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getStandingsByTournament
};
