// gameRoutes.js

const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

// POST /api/game - Create a new game board
router.post('/games', gameController.createNewGame);

// POST /api/game/:id/move - Make a move in a game
router.post('/games/:id/move', gameController.makeMove);

router.get('/games/:id', gameController.getGameById);
//reset game by id
router.post('/games/:id/reset', gameController.resetGameById);

// GET /api/rankings - Get the top five player rankings
router.get('/rankings', gameController.getTopRankings);

router.get('/games', gameController.getJoinableGames);
router.delete('/games', gameController.deleteAllGames);

module.exports = router;
