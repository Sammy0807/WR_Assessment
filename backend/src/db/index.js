// db.js

const { Pool } = require('pg');
const { databaseURL } = require('../config');

const pool = new Pool({
  connectionString: databaseURL,
});

const createGameTableSQL = `
CREATE TABLE IF NOT EXISTS games (
  id SERIAL PRIMARY KEY,
  state TEXT NOT NULL,
  player_turn CHAR(1) NOT NULL CHECK (player_turn IN ('X', 'O')),
  winner CHAR(1) CHECK (winner IN ('X', 'O', NULL)),
  game_name TEXT NOT NULL UNIQUE,
  x_player TEXT,
  o_player TEXT,
  x_score INT NOT NULL,
  o_score INT NOT NULL,
  is_game_over BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL
);
`;

// Initialize the games table
const initializeDB = async () => {
  try {
    await pool.query(createGameTableSQL);
    console.log('Initialized games table successfully.');
  } catch (error) {
    console.error('Failed to initialize games table:', error);
    process.exit(1); // Exit the process with an error code
  }
};

// Call the function to initialize the DB on startup
initializeDB();

// Function to create a new game in the database
const createGame = async (game) => {
    try {
      // Serialize the game state
      const gameState = game.serializeForDatabase();
      const result = await pool.query(
        'INSERT INTO games (state, player_turn, is_game_over, game_name, x_player, o_player, winner, x_score, o_score, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id',
        [gameState.state, gameState.player_turn, gameState.is_game_over, gameState.game_name, gameState.x_player, gameState.o_player, gameState.winner, gameState.x_score, gameState.o_score, gameState.status]
      );
      return result.rows[0].id; // Return the new game ID
    } catch (err) {
      console.error(err)
      throw new Error('Error creating the game in the database');
    }
  };

const checkExistingGameName = async (gameName) => {
    const result = await pool.query('SELECT * FROM games WHERE game_name = $1', [gameName]);
    return  result.rows.length > 0? true : false;
  };

  const getJoinableGames = async () => {
    const result = await pool.query(`SELECT * FROM games WHERE status = 'pending'`);
    return result.rows;
  };

// Function to retrieve a game by its ID
const getGameById = async (gameId) => {
  const result = await pool.query('SELECT * FROM games WHERE id = $1', [gameId]);
  if (result.rows.length) {
    return result.rows[0]; // Return the game data
  } else {
    throw new Error('Game not found');
  }
};

// Function to update the game state in the database
const updateGameState = async (id, game) => {
  const gameState = game.serializeForDatabase();
  // Implement the logic to update the game state
  await pool.query('UPDATE games SET state = $1, player_turn = $2, is_game_over = $3, game_name = $4, x_player = $5, o_player = $6, winner = $7, x_score = $8, o_score = $9, status = $10 WHERE id = $11', [gameState.state, gameState.player_turn, gameState.is_game_over, gameState.game_name, gameState.x_player, gameState.o_player, gameState.winner, gameState.x_score, gameState.o_score, gameState.status, id]);
};

// Function to get the top player rankings
const getTopRankings = async () => {
  // Implement the logic to retrieve top rankings
  const result = await pool.query(`
  SELECT
  CASE
    WHEN x_score > o_score THEN x_player
    WHEN o_score > x_score THEN o_player
  END AS player,
  SUM(CASE
        WHEN x_score > o_score THEN x_score
        WHEN o_score > x_score THEN o_score
      END) AS wins
FROM
  games
WHERE
  games.status = 'completed'
GROUP BY
  CASE
    WHEN x_score > o_score THEN x_player
    WHEN o_score > x_score THEN o_player
  END
ORDER BY wins DESC
LIMIT 5
  `);
  return result.rows; // Return the rankings
};

const deleteAllGame = async () => {
  console.log('>>>>>')
  const result = await pool.query('DELETE FROM games');
  console.log(result,'result')
  return result.rows; 
};

module.exports = {
  pool,
  createGame,
  getGameById,
  updateGameState,
  getTopRankings,
  getJoinableGames,
  deleteAllGame,
  checkExistingGameName
};
