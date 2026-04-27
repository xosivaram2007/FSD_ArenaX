const Match = require('../models/Match');
const Standing = require('../models/Standing');
const Tournament = require('../models/Tournament');

// @desc    Schedule a match
// @route   POST /api/matches
// @access  Private (Admin)
const createMatch = async (req, res) => {
  try {
    const { tournamentId, teamA, teamB, date } = req.body;

    if (!tournamentId || !teamA || !teamB) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) return res.status(404).json({ message: 'Tournament not found' });

    const isAdmin = req.user.role === 'Admin';
    const isAssignedSupervisor = req.user.role === 'Supervisor' && tournament.supervisor?.toString() === req.user.id;

    if (!isAdmin && !isAssignedSupervisor) {
      return res.status(403).json({ message: 'Not authorized to create matches for this tournament' });
    }

    const match = await Match.create({
      tournamentId,
      teamA,
      teamB,
      date,
    });

    res.status(201).json(match);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get matches for a tournament
// @route   GET /api/matches/tournament/:tournamentId
// @access  Public
const getMatchesByTournament = async (req, res) => {
  try {
    const matches = await Match.find({ tournamentId: req.params.tournamentId })
      .populate('teamA', 'name')
      .populate('teamB', 'name');
    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update match score and status
// @route   PUT /api/matches/:id
// @access  Private (Admin)
const updateMatch = async (req, res) => {
  try {
    const { scoreA, scoreB, status } = req.body;
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    const tournament = await Tournament.findById(match.tournamentId);
    if (!tournament) return res.status(404).json({ message: 'Tournament not found' });

    const isAdmin = req.user.role === 'Admin';
    const isAssignedSupervisor = req.user.role === 'Supervisor' && tournament.supervisor?.toString() === req.user.id;

    if (!isAdmin && !isAssignedSupervisor) {
      return res.status(403).json({ message: 'Not authorized to update matches for this tournament' });
    }

    const previousStatus = match.status;

    match.scoreA = scoreA !== undefined ? scoreA : match.scoreA;
    match.scoreB = scoreB !== undefined ? scoreB : match.scoreB;
    match.status = status || match.status;

    await match.save();

    // If match is transitioning to completed, update standings
    if (previousStatus !== 'Completed' && match.status === 'Completed') {
      await updateStandings(match.tournamentId, match.teamA, match.teamB, match.scoreA, match.scoreB);
    }

    res.status(200).json(match);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Helper function to update standings
const updateStandings = async (tournamentId, teamAId, teamBId, scoreA, scoreB) => {
  const standingA = await Standing.findOne({ tournamentId, teamId: teamAId });
  const standingB = await Standing.findOne({ tournamentId, teamId: teamBId });

  if (!standingA || !standingB) return;

  if (scoreA > scoreB) {
    // Team A wins
    standingA.wins += 1;
    standingA.points += 3;
    standingB.losses += 1;
  } else if (scoreB > scoreA) {
    // Team B wins
    standingB.wins += 1;
    standingB.points += 3;
    standingA.losses += 1;
  } else {
    // Draw
    standingA.draws += 1;
    standingA.points += 1;
    standingB.draws += 1;
    standingB.points += 1;
  }

  await standingA.save();
  await standingB.save();
};

module.exports = {
  createMatch,
  getMatchesByTournament,
  updateMatch,
};
