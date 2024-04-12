const gameController = require('./gameController');
const Game = require('../models/Game');
const db = require('../db');

jest.mock('../models/Game');
jest.mock('../db');

// Helper function to create a mock request (req) object
const mockRequest = (sessionData, body) => ({
  session: { data: sessionData },
  body,
  params: {},
});

// Helper function to create a mock response (res) object
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('createNewGame', () => {
    it('should create a new game successfully', async () => {
      const req = mockRequest({}, { playerName: 'John Doe', gameName: 'New Game' });
      const res = mockResponse();
      db.checkExistingGameName.mockResolvedValue(false);
      db.createGame.mockResolvedValue('123');  // Assuming '123' is the game ID
  
      await gameController.createNewGame(req, res);
  
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        gameId: '123',
        message: 'New game created successfully'
      });
    });
  
    it('should return 400 if game name already exists', async () => {
      const req = mockRequest({}, { playerName: 'John Doe', gameName: 'Old Game' });
      const res = mockResponse();
      db.checkExistingGameName.mockResolvedValue(true);
  
      await gameController.createNewGame(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Game Name already exists'
      });
    });
  });

  describe('makeMove', () => {
    it.skip('should handle a valid move correctly', async () => {
        const req = {
          params: { id: '1' },
          body: { playerId: 'player1', position: 0 }
        };
        const res = mockResponse();
        const gameData = {
          state: JSON.stringify(Array(9).fill(null)),
          x_player: 'player1',
          o_player: 'player2',
          player_turn: 'X',
        };
    
        // Setting the game to match the turn and ensure the move is valid
        db.getGameById.mockResolvedValue(gameData);
        const mockGameInstance = {
          loadFromState: jest.fn(),
          makeMove: jest.fn().mockReturnValue({ valid: true, message: 'Move made' }),
          serializeForDatabase: jest.fn().mockReturnValue({ some: 'state' })
        };
        Game.mockImplementation(() => mockGameInstance);
    
        await gameController.makeMove(req, res);
    
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Move made',
          game: mockGameInstance.serializeForDatabase()
        });
    });    
   
    it('should return 404 if game not found', async () => {
      const req = mockRequest({}, { playerId: 'player1', position: 1 });
      req.params.id = 'game123';
      const res = mockResponse();
      db.getGameById.mockResolvedValue(null);
  
      await gameController.makeMove(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Game not found'
      });
    });
  });  
  describe('resetGameById', () => {
    it('should successfully reset an existing game', async () => {
      const req = mockRequest({}, {});
      req.params.id = 'game123';
      const res = mockResponse();
      const gameData = { id: 'game123', state: JSON.stringify(Array(9).fill(null)) };
      db.getGameById.mockResolvedValue(gameData);
      
      const mockGameInstance = {
        loadFromState: jest.fn(),
        resetGame: jest.fn(),
        serializeForDatabase: jest.fn().mockReturnValue(gameData)
      };
      Game.mockImplementation(() => mockGameInstance);
  
      db.updateGameState.mockResolvedValue({});
  
      await gameController.resetGameById(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Reset Game successfully',
        game: mockGameInstance.serializeForDatabase()
      });
      expect(db.updateGameState).toHaveBeenCalled();
    });
  
    it('should return 404 if the game is not found', async () => {
      const req = mockRequest({}, {});
      req.params.id = 'game123';
      const res = mockResponse();
      db.getGameById.mockResolvedValue(null);
  
      await gameController.resetGameById(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Game not found'
      });
    });
  });
  
  describe('getTopRankings', () => {
    it('should retrieve and return top rankings', async () => {
      const res = mockResponse();
      const rankings = [{ player: 'player1', score: 5 }];
      db.getTopRankings.mockResolvedValue(rankings);
  
      await gameController.getTopRankings(null, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ rankings });
    });
  
    it('should handle errors when fetching rankings', async () => {
      const res = mockResponse();
      db.getTopRankings.mockRejectedValue(new Error('Database error'));
  
      await gameController.getTopRankings(null, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving rankings' });
    });
  });
  describe('getJoinableGames', () => {
    it('should return all joinable games', async () => {
      const res = mockResponse();
      const games = [{ id: 'game123', name: 'Chess' }];
      db.getJoinableGames.mockResolvedValue(games);
  
      await gameController.getJoinableGames(null, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ games });
    });
  
    it('should handle errors when fetching joinable games', async () => {
      const res = mockResponse();
      db.getJoinableGames.mockRejectedValue(new Error('Database error'));
  
      await gameController.getJoinableGames(null, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving games' });
    });
  });

  describe('getGameById', () => {
    it('should return the game if it is found', async () => {
      const req = mockRequest({}, {});
      req.params.id = 'game123';
      const res = mockResponse();
      const gameData = { id: 'game123', name: 'Chess' };
      db.getGameById.mockResolvedValue(gameData);
  
      await gameController.getGameById(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ game: gameData });
    });
  
    it.skip('should return 500 if no game is found', async () => {
      const req = mockRequest({}, {});
      req.params.id = '123';
      const res = mockResponse();
      db.getGameById.mockResolvedValue(new Error('Game not found'));
  
      await gameController.getGameById(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving game' });
    });
  });

  describe('deleteAllGames', () => {
    it('should delete all games and return successful message', async () => {
      const res = mockResponse();
      db.deleteAllGame.mockResolvedValue({});
  
      await gameController.deleteAllGames(null, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message:  "All games deleted successfully." });
    });
  
    it('should handle errors when deleting games', async () => {
      const res = mockResponse();
      db.deleteAllGame.mockRejectedValue(new Error('Database error'));
  
      await gameController.deleteAllGames(null, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });
  
  
  