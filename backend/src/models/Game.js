class Game {
    constructor() {
      this.board = Array(9).fill(null); // A 1D array to represent the 3x3 board
      // this.players = []; // Array to hold player information
      this.name = null;
      this.xPlayer = null;
      this.oPlayer = null;
      this.currentTurn = "X"; // X always starts
      this.winner = null; // Hold the winner ('X' or 'O')
      this.isGameOver = false;
      this.state = JSON.stringify(this.board);
      this.xScore = 0;
      this.oScore = 0;
      this.status = "pending"; // [pending, in_progress, completed]
    }
  
    // Add player to the game
    addPlayer(player) {
      if (this.xPlayer && !this.oPlayer) {
        this.oPlayer = player;
      } else if (this.oPlayer && !this.xPlayer) {
        this.xPlayer = player;
      } else if (!this.xPlayer && !this.oPlayer) {
        this.xPlayer = player
        this.currentTurn = "X"
      }
    }
  
    // Make a move on the board
    makeMove(position, player) {
      // Ensure that 'player1' corresponds to 'X' and 'player2' corresponds to 'O'
      const playerSymbol = (player === this.xPlayer) ? 'X' : 'O';

      if (this.isGameOver) {
        return { valid: false, message: 'Game over, reset game to continue' };
      }

      if (this.currentTurn !== playerSymbol) {
        return { valid: false, message: 'Not your turn' }
      }

      if (this.board[position] !== null) {
        return { valid: false, message: 'Invalid move' }
      }
      
      this.board[position] = playerSymbol;
      this.toggleTurn();
      this.checkForWin();
      this.checkForTie();
      return { valid: true, message: `${player} Move made` };
      
    }    
    
    // Toggle the current turn between 'X' and 'O'
    toggleTurn() {
      this.currentTurn = this.currentTurn === "X" ? "O" : "X";
    }
  
    // Check for a win or tie and update game state
    checkForWin() {
      const winningCombinations = [
        [0, 1, 2], // Rows
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6], // Columns
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8], // Diagonals
        [2, 4, 6],
      ];
  
      for (const combo of winningCombinations) {
        const [a, b, c] = combo;
        if (
          this.board[a] &&
          this.board[a] === this.board[b] &&
          this.board[a] === this.board[c]
        ) {
          this.isGameOver = true;
          this.winner = this.board[a];
          if (this.board[a] === "X") {
            this.xScore += 1;
          } else {
            this.oScore += 1;
          }
          return;
        }
      }
    }
  
    // Check for a tie (if all cells are filled and there's no winner)
    checkForTie() {
      if (this.board.every(position => position !== null) && !this.winner) {
        this.isGameOver = true;
      }
    }
  
    // Reset the game to play again
    resetGame() {
      this.board = Array(9).fill(null);
      this.currentTurn = 'X';
      this.winner = null;
      this.isGameOver = false;
    }

    endGame() {

      if (this.xScore === this.oScore) {
        return { valid: false, message: 'Game cannot end without a winner' };
      }

      this.resetGame()
      this.status = "completed";

      return { valid: true, message: 'Game ended' };
    }

    serializeForDatabase() {
        return {
          state: JSON.stringify(this.board),
          player_turn: this.currentTurn,
          is_game_over: this.isGameOver,
          game_name: this.name,
          x_player: this.xPlayer,
          o_player: this.oPlayer,
          x_score: this.xScore,
          o_score: this.oScore,
          winner: this.winner,
          status: this.status,
          // Add other game properties to serialize as needed
        };
      }

      loadFromState(gameData) {
        // Check if 'gameData.state' is a string before parsing
        if (typeof gameData.state === 'string') {
          this.board = JSON.parse(gameData.state);
        } else {
          // If 'gameData.state' is already an object, use it directly or throw an error
          this.board = gameData.state || Array(9).fill(null); // Use a default value if necessary
        }
        this.currentTurn = gameData.player_turn;
        this.isGameOver = gameData.is_game_over;
        this.winner = gameData.winner;
        this.xPlayer = gameData.x_player;
        this.oPlayer = gameData.o_player;
        this.xScore = gameData.x_score;
        this.oScore = gameData.o_score;
        this.name = gameData.game_name;
        this.status = gameData.status;
        
        // // Assuming the players are stored in a JSON string in the database
        // if (gameData.players && typeof gameData.players === 'string') {
        //   this.players = JSON.parse(gameData.players);
        // } else {
        //   this.players = gameData.players || []; // Use a default value if necessary
        // }
    
        // ... other properties you might have
      }
  }
  
  module.exports = Game;
  