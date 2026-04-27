const Team = require('../models/Team');
const Standing = require('../models/Standing');

// @desc    Register a new team for a tournament
// @route   POST /api/teams
// @access  Private (Manager/Admin)
const registerTeam = async (req, res) => {
  try {
    const { name, players, tournamentId } = req.body;

    if (!name || !tournamentId) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    const team = await Team.create({
      name,
      players: players || [],
      tournamentId,
      manager: req.user._id,
    });

    // Initialize standings for this team in the tournament
    await Standing.create({
      tournamentId,
      teamId: team._id,
    });

    res.status(201).json(team);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all teams for a tournament
// @route   GET /api/teams/tournament/:tournamentId
// @access  Public
const getTeamsByTournament = async (req, res) => {
  try {
    const teams = await Team.find({ tournamentId: req.params.tournamentId }).populate('manager', 'name email');
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add player to team
// @route   PUT /api/teams/:id/players
// @access  Private (Manager/Admin)
const addPlayerToTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Check if user is the manager, an Admin, or a global Manager
    if (team.manager?.toString() !== req.user.id && req.user.role !== 'Admin' && req.user.role !== 'Manager') {
      return res.status(403).json({ message: 'Not authorized to modify this team' });
    }

    const { player } = req.body;
    if (!player || !player.name) {
      return res.status(400).json({ message: 'Please provide a player name' });
    }

    team.players.push(player);
    await team.save();

    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single team by ID
// @route   GET /api/teams/:id
// @access  Public
const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('manager', 'name email');
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Remove player from team
// @route   DELETE /api/teams/:id/players/:playerName
// @access  Private (Manager/Admin)
const removePlayerFromTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Check if user is the manager, an Admin, or a global Manager
    if (team.manager?.toString() !== req.user.id && req.user.role !== 'Admin' && req.user.role !== 'Manager') {
      return res.status(403).json({ message: 'Not authorized to modify this team' });
    }

    const { playerName } = req.params;
    
    // Filter out the player
    team.players = team.players.filter(player => player.name !== playerName);
    await team.save();

    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete team
// @route   DELETE /api/teams/:id
// @access  Private (Manager/Admin)
const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (team.manager?.toString() !== req.user.id && req.user.role !== 'Admin' && req.user.role !== 'Manager') {
      return res.status(403).json({ message: 'Not authorized to delete this team' });
    }

    // also delete standings for this team
    await Standing.deleteOne({ teamId: team._id, tournamentId: team.tournamentId });
    await team.deleteOne();

    res.status(200).json({ message: 'Team removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


module.exports = {
  registerTeam,
  getTeamsByTournament,
  addPlayerToTeam,
  getTeamById,
  removePlayerFromTeam,
  deleteTeam
};
