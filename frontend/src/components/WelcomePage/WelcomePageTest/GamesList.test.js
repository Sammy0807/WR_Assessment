import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GamesList } from '../GamesList';
import { mockAppValues, mockSocketValues, mockWelcomeValues, renderWithGameContext, renderWithWelcomeContext } from '../../../utils/testMocks';
import '@testing-library/jest-dom/extend-expect';

const socketValues = mockSocketValues;
const appValues = mockAppValues;
const welcomeValues = mockWelcomeValues;

describe('GamesList', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
writable: true,
value: jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
})),
})
})

  test('renders the list of games', () => {

    renderWithWelcomeContext(appValues, socketValues, welcomeValues, <GamesList />)

    expect(screen.getByText('Existing Games')).toBeInTheDocument();
    expect(screen.getByText(welcomeValues.games[0].game_name)).toBeInTheDocument();
    expect(screen.getByText(welcomeValues.games[0].game_name)).toBeInTheDocument();
  });
});