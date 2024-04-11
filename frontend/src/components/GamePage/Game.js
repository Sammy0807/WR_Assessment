import React from 'react';
import { Board } from './Board';
import { useGame } from '../../context/GameContext';
import { Button } from 'antd';
import { useApp } from '../../context/AppContext';
import { useSocket } from '../../context/SocketContext';

export const Game = () => {
    const { playerName } = useApp();
    
    const { handleResetGame, handleGoToHomePage, handleEndGame } = useGame();
    const { game } = useSocket();

    return (
        <div className="game-page">
            <div className="scoreboard">
                <h2>{game?.x_player}: {game?.x_score}</h2>
                <h2>{game?.o_player}: {game?.o_score}</h2>
            </div>
            <h2>Player: {playerName}</h2>
            {game?.winner && <h2>Winner: {game.winner === 'X' ? game?.x_player : game?.o_player}</h2>}
            {game?.status === "pending" && <p>Waiting for Second Player to join {game?.game_name}</p>}
            <Board />
            <Button onClick={handleResetGame} type="primary" style={{ marginTop: '20px' }}>Reset Game</Button>
            <Button onClick={handleGoToHomePage} type="default" style={{ marginTop: '20px' }}>Back</Button>
            <Button onClick={handleEndGame} type="primary" style={{ marginTop: '20px' }}>End Game</Button>
        </div>
    );
};
