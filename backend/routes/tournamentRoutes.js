const express = require('express');
const router = express.Router();
const { createTournament, getTournaments, getTournamentById, updateTournament, deleteTournament } = require('../controllers/tournamentController');
const { protect, authorize, optionalAuth } = require('../middleware/authMiddleware');

router.route('/')
  .get(optionalAuth, getTournaments)
  .post(protect, authorize('Admin'), createTournament);

router.route('/:id')
  .get(getTournamentById)
  .put(protect, authorize('Admin', 'Supervisor'), updateTournament)
  .delete(protect, authorize('Admin'), deleteTournament);

module.exports = router;
