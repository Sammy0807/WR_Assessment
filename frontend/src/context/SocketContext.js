import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useApp } from './AppContext';
import { socketUrl } from '../utils/constants';

export const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [game, setGame] = useState(null);
    const [resettingGame, setResettingGame] = useState(false);  

    const { messageApi } = useApp();

    useEffect(() => {
        const newSocket = game?.id ? io(socketUrl, {
            query: {
                gameId: game.id
            }
        }) : io(socketUrl);
        setSocket(newSocket);

        return () => newSocket.close();
    },[game?.id]);

    useEffect(() => {
        if (socket && game?.id) {
            socket.on('gameJoined', (data) => {
                if (data.game.id === game.id) {
                    setGame(data.game);
                }
            });
        
            socket.on('moveMade', (data) => {
                if (data.game.id === game.id) {
                    setGame(data.game);
                    messageApi.open({
                        type: 'success',
                        content: data.message,
                    });
                }
            });
        
            socket.on('gameReset', (data) => {
                if (data.game.id === game.id) {
                    setGame(data.game);
                    messageApi.open({
                        type: 'success',
                        content: data.message,
                    });
                    setResettingGame(false);
                }
            });
        
            socket.on('gameEnded', (data) => {
                if (data.game.id === game.id) {
                    setGame(data.game);
                    messageApi.open({
                        type: 'success',
                        content: data.message,
                    });
                }
            });
        
            socket.on('error', (data) => {
                const { message } = data;
                console.log(message);
                messageApi.open({
                    type: 'error',
                    content: message,
                });
            })
        }

    }, [socket, messageApi, game?.id])

    const joinGame = (gameId, name) => {
        socket.emit('joinGame', gameId, name);
    }

    const rejoinGame = (gameId, name) => {
        socket.emit('rejoinGame', gameId, name);
    }

    const makeMove = (gameId, player, position) => {
        socket.emit('makeMove', gameId, { player, position });
    }

    const resetGame = (gameId) => {
        setResettingGame(true);
        socket.emit('resetGame', gameId);
    }

    const endGame = (gameId) => {
        socket.emit('endGame', gameId);
    }

    return (
        <SocketContext.Provider value={{
            socket,
            setSocket,
            joinGame,
            makeMove,
            resetGame,
            endGame,
            game,
            setGame,
            rejoinGame,
            resettingGame, setResettingGame

        }}>
            {children}
        </SocketContext.Provider>
    );
};
