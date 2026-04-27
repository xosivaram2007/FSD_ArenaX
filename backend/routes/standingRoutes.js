const express = require('express');
const router = express.Router();
const { getStandingsByTournament } = require('../controllers/standingController');

router.get('/tournament/:tournamentId', getStandingsByTournament);

module.exports = router;
