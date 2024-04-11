import React from 'react';
import { Square } from './Square';
import { useGame } from '../../context/GameContext';

export const Board = () => {
    const { board } = useGame();

    return (
        <div className="board">
            {board.map((value, index) => (
                <Square key={index} value={value} index={index} board={board} />
            ))}
        </div>
    );
};
