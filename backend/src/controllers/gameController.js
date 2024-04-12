// gameController.js

const Game = require('../models/Game');
const db = require('../db');
// Create a new game and store it in the database
const createNewGame = async (req, res) => {
  try {
    const { playerName, gameName } = req.body;
    if (await db.checkExistingGameName(gameName)) {
      return res.status(400).json({ message: 'Game Name already exists' });
    }
    const newGame = new Game();
    newGame.name = gameName;
    newGame.xPlayer = playerName;
    const gameId = await db.createGame(newGame); // Stub function for DB operation
    res.status(201).json({ gameId: gameId, message: 'New game created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error creating new game' });
  }
};

// Make a move in a game
const makeMove = async (req, res) => {
  const gameId = req.params.id; 
  const { playerId, position } = req.body; 
  try {
    // Retrieve the game from the database using the gameId
    const gameData = await db.getGameById(gameId);
    if (!gameData) {
      return res.status(404).json({ message: "Game not found" });
    }

    // Deserialize the game state and players
    const game = new Game();
    game.loadFromState(gameData);

    if (game.currentTurn !== (playerId === game.xPlayer ? 'X' : 'O')) {
      return res.status(400).json({ message: "Not your turn" });
    }

    // Attempt to make the move
    const moveResult = game.makeMove(position, playerId);
    
    if (moveResult.valid) {
      // If the move was successful, update the game state in the database
      await db.updateGameState(game.serializeForDatabase());
      return res.status(200).json({
        message: moveResult.message,
        game: game.serializeForDatabase()
      });
    } else {
      // If the move was not successful, return a bad request response
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
        game: game.serializeForDatabase() // Serialize the game state to send back to the client
      });
    
  } catch (error) {
    res.status(500).json({ error});
  }
};

// Display the ranking of top five players
const getTopRankings = async (req, res) => {
  try {
    const rankings = await db.getTopRankings(); // Stub function for DB operation
    res.status(200).json({ rankings });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving rankings' });
  }
};

const getJoinableGames = async (req, res) => {
  try {
    const games = await db.getJoinableGames(); // Stub function for DB operation
    res.status(200).json({ games });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving games' });
  }
};

const getGameById = async (req, res) => {
  try {
    const gameId = req.params.id;
    const game = await db.getGameById(gameId); // Stub function for DB operation
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
