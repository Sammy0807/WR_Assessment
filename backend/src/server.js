const app = require('./app');
const { port } = require('./config');
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "*"
  }
});

const db = require("./db");
const Game = require('./models/Game');

io.on('connection', (socket) => {
  const gameId = socket.handshake.query.gameId;
  console.log(gameId, 'gameId')
  console.log("connected");

  gameId && socket.join(gameId.toString());

  socket.on('joinGame', async (gameId, userName) => {
    try {
      const game = new Game();
      const gameData = await db.getGameById(gameId);

      if (!gameData) {
        console.log("NO DATA")
        return
      }

      game.loadFromState(gameData)

      if (game.status === "in_progress") {
        if (game.xPlayer !== userName && game.oPlayer !== userName) {
          socket.emit("error", {
            message: "cannot join game"
          })
        }

      } else if (game.status === "pending") {
        if (game.xPlayer || game.oPlayer) {
          game.status = "in_progress"
        }
      } else {
        socket.emit("error", {
          message: "cannot join a copleted game"
        })
      }

      game.addPlayer(userName)

      await db.updateGameState(gameId, game)

      io.to(gameId.toString()).emit('gameJoined', {
        message: `user ${userName} joined`,
        game: {
          id: gameData.id,
          ...game.serializeForDatabase()
        }
      });
      console.log(`user ${userName} joined`)
    } catch (error) {
      console.error(error);
      socket.emit("error", {
        message: "an error occured"
      })
    }
  });

  socket.on('makeMove', async (gameId, params) => {
    try {
      // handle the move made by a player
      const { player, position } = params; // Extract the playerId and position from the request body

      // Retrieve the game from the database using the gameId
      const gameData = await db.getGameById(gameId);
      if (!gameData) {
        return { message: "Game not found" };
      }

      // Deserialize the game state and players
      const game = new Game();
      game.loadFromState(gameData);

      // Attempt to make the move
      const moveResult = game.makeMove(position, player);

      if (moveResult.valid) {
        // If the move was successful, update the game state in the database
        await db.updateGameState(gameId, game);
        io.to(gameId.toString()).emit("moveMade", {
          message: moveResult.message,
          game: {
            id: gameData.id,
            ...game.serializeForDatabase()
          } // Serialize the game state to send back to the client
        });
      } else {
        // If the move was not successful, return a bad request response
        socket.emit("error", {
          message: moveResult.message,
        });
      }
    } catch (error) {
      console.error(error);
      socket.emit("error", {
        message: "an error occured"
      })
    }
  });

  socket.on("resetGame", async (gameId) => {
    console.log('backend reset games >>>>')
    try {
      const gameData = await db.getGameById(gameId);
      if (!gameData) {
        socket.emit("error", {
          message: "game not found"
        })
      }

      const game = new Game();
      game.loadFromState(gameData);
      game.resetGame();

      await db.updateGameState(gameId, game);
      io.to(gameId.toString()).emit("gameReset", {
        message: "Reset Game Successfully",
        game: {
          id: gameData.id,
          ...game.serializeForDatabase()
        } // Serialize the game state to send back to the client
      });

    } catch (error) {
      console.error(error);
      socket.emit("error", {
        message: "an error occured"
      })
    }
  })

  socket.on("rejoinGame", async (gameId, userName) => {
    try {
      const gameData = await db.getGameById(gameId);
      if (!gameData) {
        socket.emit("error", {
          message: "game not found"
        })
      }

      const game = new Game();
      game.loadFromState(gameData);

      io.to(gameId.toString()).emit('gameJoined', {
        message: `user ${userName} joined`,
        game: {
          id: gameData.id,
          ...game.serializeForDatabase()
        }
      });

    } catch (error) {
      console.error(error);
      socket.emit("error", {
        message: "an error occured"
      })
    }
  })


  socket.on("endGame", async (gameId) => {
    try {
      const gameData = await db.getGameById(gameId);
      if (!gameData) {
        socket.emit("error", {
          message: "game not found"
        })
      }

      const game = new Game();
      game.loadFromState(gameData);
      const res = game.endGame()

      if (res.valid) {
        await db.updateGameState(gameId, game);

        io.to(gameId.toString()).emit('gameEnded', {
          message: res.message,
          game: {
            id: gameData.id,
            ...game.serializeForDatabase()
          }
        });
      } else {
        socket.emit('error', {
          message: res.message
        });
      }
    } catch (error) {
      console.error(error);
      socket.emit("error", {
        message: "an error occured"
      })
    }
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});


server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = { io }