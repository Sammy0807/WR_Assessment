import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Game } from '../Game';
import { mockAppValues, mockGameValues, mockSocketValues, renderWithGameContext } from '../../../utils/testMocks';


const socketValues = mockSocketValues;
const appValues = mockAppValues;
const gameValues = mockGameValues;

describe('Game', () => {

    test('renders game page with correct player name and scores', () => {
        renderWithGameContext(appValues, socketValues, gameValues, <Game />)

        const xString = `${socketValues.game.x_player}: ${socketValues.game.x_score}`
        const oString = `${socketValues.game.o_player}: ${socketValues.game.o_score}`
        expect(screen.getByText(xString)).toBeInTheDocument();
        expect(screen.getByText(oString)).toBeInTheDocument();
    });

    test('renders winner when game has a winner', () => {
        socketValues.game.winner = "X"
        socketValues.game.x_score = 1
        renderWithGameContext(appValues, socketValues, gameValues, <Game />)

        expect(screen.getByText(/winner/i)).toBeInTheDocument();
    });

    test('renders waiting message when game status is pending', () => {
        socketValues.game.status = "pending"
        renderWithGameContext(appValues, socketValues, gameValues, <Game />)

        expect(screen.getByText(/waiting for second player/i)).toBeInTheDocument();
    });

    test('calls handleResetGame when reset game button is clicked', () => {
        renderWithGameContext(appValues, socketValues, gameValues, <Game />)

        fireEvent.click(screen.getByText('Reset Game'));
        expect(gameValues.handleResetGame).toHaveBeenCalled();
    });

    test('calls handleGoToHomePage when back button is clicked', () => {
        renderWithGameContext(appValues, socketValues, gameValues, <Game />)

        fireEvent.click(screen.getByText('Back'));
        expect(gameValues.handleGoToHomePage).toHaveBeenCalled();
    });

    test('calls handleEndGame when end game button is clicked', () => {
        renderWithGameContext(appValues, socketValues, gameValues, <Game />)

        fireEvent.click(screen.getByText('End Game'));
        expect(gameValues.handleEndGame).toHaveBeenCalled();
    });
});