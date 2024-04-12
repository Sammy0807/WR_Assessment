
const Game = require('../models/Game');
const db = require('../db');

const createNewGame = async (req, res) => {
  try {
    const { playerName, gameName } = req.body;
    if (await db.checkExistingGameName(gameName)) {
      return res.status(400).json({ message: 'Game Name already exists' });
    }
    const newGame = new Game();
    newGame.name = gameName;
    newGame.xPlayer = playerName;
    const gameId = await db.createGame(newGame);
    res.status(201).json({ gameId: gameId, message: 'New game created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error creating new game' });
  }
};

const makeMove = async (req, res) => {
  const gameId = req.params.id; 
  const { playerId, position } = req.body; 
  try {
    const gameData = await db.getGameById(gameId);
    if (!gameData) {
      return res.status(404).json({ message: "Game not found" });
    }

    const game = new Game();
    game.loadFromState(gameData);
    
    const moveResult = game.makeMove(position, playerId);
    
    if (moveResult.valid) {
      await db.updateGameState(game.serializeForDatabase());
      return res.status(200).json({
        message: moveResult.message,
        game: game.serializeForDatabase()
      });
    } else {
      return res.status(400).json({ message: moveResult.message });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error making move' });
  }
};

// Reset game
const resetGameById = async (req, res) => {
  const gameId = req.params.id;
  try {
    const gameData = await db.getGameById(gameId);
    if (!gameData) {
      return res.status(404).json({ message: "Game not found" });
    }

    const game = new Game();
    game.loadFromState(gameData);
    game.resetGame();

      await db.updateGameState(gameId,game);
      return res.status(200).json({
        message: 'Reset Game successfully',
        game: game.serializeForDatabase()
      });
    
  } catch (error) {
    res.status(500).json({ error});
  }
};

// Display the ranking of top five players
const getTopRankings = async (req, res) => {
  try {
    const rankings = await db.getTopRankings();
    res.status(200).json({ rankings });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving rankings' });
  }
};

const getJoinableGames = async (req, res) => {
  try {
    const games = await db.getJoinableGames();
    res.status(200).json({ games });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving games' });
  }
};

const getGameById = async (req, res) => {
  try {
    const gameId = req.params.id;
    const game = await db.getGameById(gameId);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }
    res.status(200).json({ game });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving game' });
  }
};

const deleteAllGames = async (req, res) => {
  try {
    await db.deleteAllGame();
    res.status(200).json({ message: 'All games deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Database error' });
  }
};
module.exports = {
  createNewGame,
  makeMove,
  getTopRankings,
  getJoinableGames,
  getGameById,
  deleteAllGames,
  resetGameById
};
