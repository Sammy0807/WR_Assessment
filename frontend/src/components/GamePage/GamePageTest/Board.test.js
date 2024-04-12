import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { Board } from '../Board';
import { Square } from '../Square';
import { mockAppValues, mockGameValues, mockSocketValues, renderWithGameContext } from '../../../utils/testMocks';

const socketValues = mockSocketValues;
const appValues = mockAppValues;
const gameValues = mockGameValues;

describe('Board', () => {
  test('renders 9 squares', () => {
    renderWithGameContext(appValues, socketValues, gameValues, <Board />)
    const squares = screen.getAllByTestId(/square-/);
    expect(squares).toHaveLength(9);
  });

  test('renders square with correct value', () => {
    gameValues.board = ['X', null, null, null, null, null, null, null, null]
    renderWithGameContext(appValues, socketValues, gameValues, <Board />)
    const square = screen.getByTestId('square-0');
    expect(square.textContent).toBe('X');
  });
});