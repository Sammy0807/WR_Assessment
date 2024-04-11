import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Board } from '../Board';
import { GameProvider } from '../../../context/GameContext';
import { Square } from '../Square';

const handleMakeMove = jest.fn();
// Mock the necessary modules
jest.mock('../../../context/AppContext', () => ({
  useApp: () => ({
    playerName: 'TestPlayer',
    messageApi: { open: jest.fn() }
  }),
}));

jest.mock('../../../context/SocketContext', () => ({
  useSocket: () => ({
    game: { id: 'game123', winner: null, state: JSON.stringify(Array(9).fill(null)) },
    setGame: jest.fn(),
    resetGame: jest.fn(),
    endGame: jest.fn(),
    makeMove: jest.fn(),
  }),
}));

jest.mock('../../../hooks/useApi', () => ({
  useApi: () => ({
    getGameById: jest.fn(() => Promise.resolve({ game: { id: 'game123', status: 'started' } })),
  }),
}));

jest.mock('../../../context/GameContext', () => {
    // Import the actual GameContext to use its real Provider
    const actualContext = jest.requireActual('../../../context/GameContext');
  
    // Return the modified context with a mock for handleMakeMove
    return {
      ...actualContext,
      useGame: () => ({
        ...actualContext.useGame(),
        handleMakeMove: jest.fn() // Define the mock function directly here
      }),
    };
  });
  

// Helper to render components within the GameProvider
const renderWithGameContext = (ui) => {
  return render(<GameProvider>{ui}</GameProvider>);
};

describe('Board', () => {
  test('renders 9 squares', () => {
    renderWithGameContext(<Board />);
    const squares = screen.getAllByTestId(/square-/);
    expect(squares).toHaveLength(9);
  });

  test('renders square with correct value', () => {
    renderWithGameContext(<Square index={0} board={['X', ...Array(8).fill(null)]} />);
    const square = screen.getByTestId('square-0');
    expect(square.textContent).toBe('X');
  });

  test('calls handleMakeMove on square click', () => {
    renderWithGameContext(<Square index={0} board={Array(9).fill(null)} />);
    const square = screen.getByTestId('square-0');
    fireEvent.click(square);
     // Get the mocked handleMakeMove function from the useGame hook
  const { handleMakeMove } = useGame();

  // Assert that handleMakeMove was called with the correct argument
  expect(handleMakeMove).toHaveBeenCalledWith(0);
  });

test('renders empty square when board value is null', () => {
    renderWithGameContext(<Square index={0} board={Array(9).fill(null)} />);
    const square = screen.getByTestId('square-0');
    expect(square.textContent).toBe('');
});

test('renders endgame message when there is a winner', () => {
    renderWithGameContext(<Board />);
    const endgameMessage = screen.getByTestId('endgame-message');
    expect(endgameMessage).toBeInTheDocument();
});

test('resets the game when reset button is clicked', () => {
    const resetGame = jest.fn();
    renderWithGameContext(<Board />);
    const resetButton = screen.getByTestId('reset-button');
    fireEvent.click(resetButton);
    expect(resetGame).toHaveBeenCalled();
});
});

