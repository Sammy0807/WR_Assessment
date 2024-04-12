jest.mock('pg', () => {
    const mPool = {
        query: jest.fn(),
    };
    return { Pool: jest.fn(() => mPool) };
});

const db = require('./index.js');

describe('Database Operations', () => {
    let pool;
    beforeAll(() => {
      // Get the mock pool instance from the mocked pg module
      pool = new (require('pg').Pool)();
    });
  
    afterEach(() => {
      // Clear all mock calls after each test to ensure clean state
      jest.clearAllMocks();
    });

    describe('createGame', () => {
        it('should create a new game and return the game ID', async () => {
            const gameData = { id: 1 };
            pool.query.mockResolvedValue({ rows: [gameData], rowCount: 1 });
            const gameId = await db.createGame({ serializeForDatabase: () => ({}) });
            expect(gameId).toEqual(1);
            expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO games'), expect.any(Array));
        });
    });

    describe('getGameById', () => {
        it('should retrieve game details by ID', async () => {
            const gameData = { id: 1, game_name: 'Test Game' };
            pool.query.mockResolvedValue({ rows: [gameData] });
            const result = await db.getGameById(1);
            expect(result).toEqual(gameData);
            expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1]);
        });

        it('should throw an error if no game is found', async () => {
            pool.query.mockResolvedValue({ rows: [] });
            await expect(db.getGameById(999)).rejects.toThrow('Game not found');
        });
    });

    describe('updateGameState', () => {
        it('should update the game state correctly', async () => {
            const mockGame = {
                serializeForDatabase: jest.fn().mockReturnValue({ state: '[]' })
            };
            pool.query.mockResolvedValue({ rowCount: 1 });
            await db.updateGameState(1, mockGame);
            expect(pool.query).toHaveBeenCalledWith(expect.any(String), expect.any(Array));
        });
    });

    describe('deleteAllGame', () => {
        it('should delete all games', async () => {
            pool.query.mockResolvedValue({ rowCount: 10 });
            const result = await db.deleteAllGame();
            expect(result).toEqual([]);
            expect(pool.query).toHaveBeenCalledWith('DELETE FROM games');
        });
    });
});
