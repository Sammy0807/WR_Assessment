import React, { createContext, useContext, useState, useEffect } from 'react';
import { useApp } from './AppContext';
import { useSocket } from './SocketContext';
import { useApi } from '../hooks/useApi';
import { router } from '../App';

export const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
    const { playerName, messageApi } = useApp();
    const { getGameById } = useApi();
    const { game, setGame, resetGame, endGame, makeMove, resettingGame } = useSocket();
    const [board, setBoard] = useState(Array(9).fill(null));

    const gameId = router.state.matches[0].params?.id

    useEffect(() => {
        if (gameId) {
            getGameById(gameId).then((data) => {
                if (data?.game) {
                    setGame(data.game)
                }
            })
        } else {
            if (router.state.location.pathname !== "/") {
                router.navigate(`/`)
            }
        }
    }, [gameId])

    useEffect(() => {
        if (gameId && !playerName) {
            router.navigate(`/rejoin/${gameId}`)
        }
    }, [playerName, gameId])

    useEffect(() => {
        if (game?.status === "completed") {
            setGame(null)
            router.navigate(`/rankings`)
        }
    }, [game])

    useEffect(() => {
        if (game?.winner && !resettingGame) {
            const winner = game.winner === "X" ? game.x_player : game.o_player
            setTimeout(() => { resetGame(game.id) }, 5000)
            messageApi.open({
                type: 'success',
                content: `${winner} WON: Reseting the game in 5 seconds...`,
                duration: 5,
            });
        }
    }, [game?.winner, game?.id, messageApi, resetGame])

    useEffect(() => {
        if (game?.is_tie && !resettingGame) {
            setTimeout(() => { resetGame(game.id) }, 5000)
            messageApi.open({
                type: 'success',
                content: `GAME TIED: Reseting the game in 5 seconds...`,
                duration: 5,
            });
        }
    }, [game?.is_tie, game?.id, messageApi, resetGame])

    useEffect(() => {
        if (game?.state) {
            setBoard(JSON.parse(game?.state))
        }
    }, [game?.state])

    const handleGoToHomePage = () => {
        router.navigate(`/`)
    }

    const handleResetGame = () => {
        resetGame(game.id)
    }

    const handleEndGame = () => {
        endGame(game.id)
    }

    const handleMakeMove = (index) => {
        makeMove(game.id, playerName, index);
    };

    return (
        <GameContext.Provider value={{
            board, setBoard,
            gameId,
            handleEndGame, handleGoToHomePage, handleResetGame, handleMakeMove
        }}>
            {children}
        </GameContext.Provider>
    );
};
