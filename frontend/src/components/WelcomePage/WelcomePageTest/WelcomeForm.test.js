import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { WelcomeForm } from '../WelcomeForm';
import { mockAppValues, mockSocketValues, mockWelcomeValues, renderWithGameContext, renderWithWelcomeContext } from '../../../utils/testMocks';


const socketValues = mockSocketValues;
const appValues = mockAppValues;
const welcomeValues = mockWelcomeValues;

describe('WelcomeForm', () => {
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
  test('renders input fields and buttons', () => {
    renderWithWelcomeContext(appValues, socketValues, welcomeValues, <WelcomeForm />)

    
    // Assert that the input fields are rendered
    expect(screen.getByPlaceholderText('Your Name')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Game Name')).not.toBeInTheDocument();
    
    // Assert that the buttons are rendered
    expect(screen.getByRole('button', { name: 'Join Game' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ranking' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Game' })).toBeInTheDocument();
  });

  test('shows game name input field when selectedGame is true', () => {
    renderWithWelcomeContext(appValues, socketValues, welcomeValues, <WelcomeForm />)
    
    // Simulate selecting a game
    fireEvent.click(screen.getByRole('button', { name: 'Create Game' }));
    
    // Assert that the game name input field is rendered
    expect(welcomeValues.handleCreateGameClick).toHaveBeenCalled();
  });

  test('calls the correct event handlers on button clicks', () => {
    renderWithWelcomeContext(appValues, socketValues, welcomeValues, <WelcomeForm />)
    
    // Simulate button clicks
    fireEvent.click(screen.getByRole('button', { name: 'Ranking' }));
    fireEvent.click(screen.getByRole('button', { name: 'Create Game' }));
    
    // Assert that the correct event handlers are called
    expect(welcomeValues.handleRankingGameClick).toHaveBeenCalledTimes(1);
    expect(welcomeValues.handleCreateGameClick).toHaveBeenCalledTimes(1);
  });
});