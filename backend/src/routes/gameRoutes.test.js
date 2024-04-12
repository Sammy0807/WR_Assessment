
const request = require('supertest');
const express = require('express');
const gameRoutes = require('./gameRoutes'); // adjust the path as necessary

const app = express();
app.use(express.json()); // For parsing application/json
app.use('/api', gameRoutes); // Mount your routes under '/api' to test full paths

// Mock the gameController methods
jest.mock('../controllers/gameController', () => ({
  createNewGame: jest.fn((req, res) => res.status(201).json({ message: "Game created" })),
  makeMove: jest.fn((req, res) => res.status(200).json({ message: "Move successful" })),
  getGameById: jest.fn((req, res) => res.status(200).json({ game: { id: req.params.id } })),
  resetGameById: jest.fn((req, res) => res.status(200).json({ message: "Game reset" })),
  getTopRankings: jest.fn((req, res) => res.status(200).json({ rankings: [] })),
  getJoinableGames: jest.fn((req, res) => res.status(200).json({ games: [] })),
  deleteAllGames: jest.fn((req, res) => res.status(200).json({ message: "All games deleted" })),
}));

describe('API routes', () => {
  test('POST /api/games should create a new game', async () => {
    const response = await request(app).post('/api/games').send({ playerName: 'John', gameName: 'Chess' });
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toEqual("Game created");
  });

  test('POST /api/games/:id/move should make a move in a game', async () => {
    const response = await request(app).post('/api/games/1/move').send({ playerId: 'John', position: 2 });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual("Move successful");
  });

  test('GET /api/games/:id should retrieve a game by ID', async () => {
    const response = await request(app).get('/api/games/1');
    expect(response.statusCode).toBe(200);
    expect(response.body.game).toBeDefined();
    expect(response.body.game.id).toBe('1');
  });

  test('POST /api/games/:id/reset should reset a game by ID', async () => {
    const response = await request(app).post('/api/games/1/reset');
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual("Game reset");
  });

  test('GET /api/rankings should get top player rankings', async () => {
    const response = await request(app).get('/api/rankings');
    expect(response.statusCode).toBe(200);
    expect(response.body.rankings).toEqual([]);
  });

  test('GET /api/games should get joinable games', async () => {
    const response = await request(app).get('/api/games');
    expect(response.statusCode).toBe(200);
    expect(response.body.games).toEqual([]);
  });

  test('DELETE /api/games should delete all games', async () => {
    const response = await request(app).delete('/api/games');
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual("All games deleted");
  });
});

