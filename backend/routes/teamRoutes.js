const express = require('express');
const router = express.Router();
const { registerTeam, getTeamsByTournament, addPlayerToTeam, getTeamById, removePlayerFromTeam, deleteTeam } = require('../controllers/teamController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('Admin', 'Manager', 'User'), registerTeam);
router.get('/tournament/:tournamentId', getTeamsByTournament);
router.get('/:id', getTeamById);
router.put('/:id/players', protect, authorize('Admin', 'Manager', 'User'), addPlayerToTeam);
router.delete('/:id/players/:playerName', protect, authorize('Admin', 'Manager', 'User'), removePlayerFromTeam);
router.delete('/:id', protect, authorize('Admin', 'Manager', 'User'), deleteTeam);

module.exports = router;
