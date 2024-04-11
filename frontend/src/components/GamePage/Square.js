import React from 'react';
import { Button } from 'antd';
import { useGame } from '../../context/GameContext';

export const Square = ({ index, board }) => {
    const { handleMakeMove } = useGame();
    const onClickSquare = () => handleMakeMove(index);

    return (
        <Button className="square" onClick={onClickSquare} data-testid={`square-${index}`}>
            {board[index]}
        </Button>
    );
};
