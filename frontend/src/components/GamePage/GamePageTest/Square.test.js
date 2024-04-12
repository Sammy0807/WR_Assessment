import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Square } from '../Square';
import { mockAppValues, mockGameValues, mockSocketValues, renderWithGameContext } from '../../../utils/testMocks';

const socketValues = mockSocketValues;
const appValues = mockAppValues;
const gameValues = mockGameValues;

describe('Square', () => {
  const index = 0;

  test('renders square with correct value', () => {
    gameValues.board = ['X', 'O', null, null, null, null, null, null, null]
    renderWithGameContext(appValues, socketValues, gameValues, <Square index={index} board={gameValues.board} />)
    const square = screen.getByTestId('square-0');
    expect(square.textContent).toBe('X');
  });

  test('calls handleMakeMove when square is clicked', () => {
    renderWithGameContext(appValues, socketValues, gameValues, <Square index={index} board={gameValues.board} />)
    const square = screen.getByTestId('square-0');
    fireEvent.click(square);
    expect(gameValues.handleMakeMove).toHaveBeenCalledWith(index);
  });
});