const express = require('express');
const router = express.Router();
const { createMatch, getMatchesByTournament, updateMatch } = require('../controllers/matchController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('Admin', 'Supervisor'), createMatch);
router.get('/tournament/:tournamentId', getMatchesByTournament);
router.put('/:id', protect, authorize('Admin', 'Supervisor'), updateMatch);

module.exports = router;
