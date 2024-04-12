const Game = require('./Game');

describe('Game', () => {
  let game;

  beforeEach(() => {
    game = new Game();
  });

  describe('Initialization', () => {
    it('initializes with an empty board', () => {
      expect(game.board.every(square => square === null)).toBe(true);
    });

    it('initializes with no winner and game not over', () => {
      expect(game.winner).toBeNull();
      expect(game.isGameOver).toBe(false);
    });
  });

  describe('addPlayer', () => {
    it('adds the first player as X', () => {
      game.addPlayer('Alice');
      expect(game.xPlayer).toBe('Alice');
    });

    it('adds the second player as O', () => {
      game.addPlayer('Alice');
      game.addPlayer('Bob');
      expect(game.oPlayer).toBe('Bob');
    });
  });

  describe('makeMove', () => {
    beforeEach(() => {
      game.addPlayer('Alice');
      game.addPlayer('Bob');
    });

    it('allows a valid move and toggles turn', () => {
      const result = game.makeMove(0, 'Alice');
      expect(result.valid).toBe(true);
      expect(game.board[0]).toBe('X');
      expect(game.currentTurn).toBe('O');
    });

    it('rejects a move when it is not the player\'s turn', () => {
      const result = game.makeMove(0, 'Bob');
      expect(result.valid).toBe(false);
      expect(result.message).toBe('Not your turn');
    });

    it('rejects a move to a taken position', () => {
      game.makeMove(0, 'Alice');
      const result = game.makeMove(0, 'Bob');
      expect(result.valid).toBe(false);
      expect(result.message).toBe('Invalid move');
    });

    it('ends the game when a winning move is made', () => {
      game.makeMove(0, 'Alice'); // X
      game.makeMove(3, 'Bob');   // O
      game.makeMove(1, 'Alice'); // X
      game.makeMove(4, 'Bob');   // O
      const result = game.makeMove(2, 'Alice'); // X wins
      expect(result.valid).toBe(true);
      expect(game.isGameOver).toBe(true);
      expect(game.winner).toBe('X');
    });
  });

  describe('checkForTie', () => {
    it('detects a tie if all positions are filled with no winner', () => {
      game.board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
      game.checkForTie();
      expect(game.isTie).toBe(true);
      expect(game.isGameOver).toBe(true);
    });
  });

  describe('resetGame', () => {
    it('resets the game to initial state', () => {
      game.makeMove(0, 'Alice');
      game.resetGame();
      expect(game.board.every(square => square === null)).toBe(true);
      expect(game.currentTurn).toBe('X');
      expect(game.isGameOver).toBe(false);
      expect(game.winner).toBeNull();
    });
  });

  describe('endGame', () => {
    it('ends the game when conditions are met', () => {
      game.xScore = 2;
      game.oScore = 1;
      const result = game.endGame();
      expect(result.valid).toBe(true);
      expect(game.status).toBe('completed');
    });

    it('does not end game if scores are tied', () => {
      game.xScore = 1;
      game.oScore = 1;
      const result = game.endGame();
      expect(result.valid).toBe(false);
      expect(result.message).toBe('Game cannot end without a winner');
    });
  });

  describe('serializeForDatabase', () => {
    it('serializes the game state for database storage', () => {
      const serialized = game.serializeForDatabase();
      expect(serialized).toHaveProperty('state');
      expect(serialized).toHaveProperty('player_turn', 'X');
    });
  });

  describe('loadFromState', () => {
    it('loads the game state from given data', () => {
      const data = {
        state: JSON.stringify(Array(9).fill(null)),
        player_turn: 'O',
        is_game_over: false,
        game_name: 'TicTacToe',
        x_player: 'Alice',
        o_player: 'Bob',
        x_score: 0,
        o_score: 0,
        winner: null,
        status: 'pending',
        is_tie: false
      };
      game.loadFromState(data);
      expect(game.currentTurn).toBe('O');
      expect(game.name).toBe('TicTacToe');
    });
  });

});

