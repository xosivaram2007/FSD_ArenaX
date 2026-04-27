const Tournament = require('../models/Tournament');
const Standing = require('../models/Standing');
const Match = require('../models/Match');
const Team = require('../models/Team');

// @desc    Create a new tournament
// @route   POST /api/tournaments
// @access  Private/Admin
const createTournament = async (req, res) => {
  try {
    const { name, sportType, startDate, endDate, supervisor } = req.body;

    if (!name || !sportType || !startDate || !endDate) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    const tournament = await Tournament.create({
      name,
      sportType,
      startDate,
      endDate,
      createdBy: req.user._id,
      supervisor: supervisor || undefined,
    });

    res.status(201).json(tournament);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all tournaments
// @route   GET /api/tournaments
// @access  Public
const getTournaments = async (req, res) => {
  try {
    let query = {};
    
    // If user is a Supervisor, only show their assigned tournaments
    if (req.user && req.user.role === 'Supervisor') {
      query.supervisor = req.user._id;
    }

    const tournaments = await Tournament.find(query).populate('createdBy', 'name email');
    res.status(200).json(tournaments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single tournament
// @route   GET /api/tournaments/:id
// @access  Public
const getTournamentById = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id).populate('createdBy', 'name email');
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }
    res.status(200).json(tournament);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update tournament
// @route   PUT /api/tournaments/:id
// @access  Private (Admin or Supervisor)
const updateTournament = async (req, res) => {
  try {
    const { startDate, endDate, supervisor } = req.body;
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    const isAdmin = req.user.role === 'Admin';
    const isAssignedSupervisor = req.user.role === 'Supervisor' && tournament.supervisor?.toString() === req.user.id;

    if (!isAdmin && !isAssignedSupervisor) {
      return res.status(403).json({ message: 'Not authorized to update this tournament' });
    }

    if (startDate) tournament.startDate = startDate;
    if (endDate) tournament.endDate = endDate;
    if (isAdmin && supervisor !== undefined) tournament.supervisor = supervisor; // Only Admin can change supervisor

    await tournament.save();
    res.status(200).json(tournament);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete tournament
// @route   DELETE /api/tournaments/:id
// @access  Private (Admin)
const deleteTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    // Only Admin can delete tournaments
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to delete tournaments' });
    }

    // Delete associated data
    await Promise.all([
      Match.deleteMany({ tournamentId: req.params.id }),
      Team.deleteMany({ tournamentId: req.params.id }),
      Standing.deleteMany({ tournamentId: req.params.id }),
      tournament.deleteOne()
    ]);

    res.status(200).json({ message: 'Tournament and associated data removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createTournament,
  getTournaments,
  getTournamentById,
  updateTournament,
  deleteTournament
};
