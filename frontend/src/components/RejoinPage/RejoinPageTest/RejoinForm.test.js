import React from 'react';
import { render, screen, fireEvent, renderHook } from '@testing-library/react';
import { RejoinForm } from '../RejoinForm';
import { mockAppValues, mockGameValues, mockSocketValues, mockUseRejoinHandler, renderWithGameContext } from '../../../utils/testMocks';
import '@testing-library/jest-dom/extend-expect';
import { Form } from 'antd';

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

const socketValues = mockSocketValues;
const appValues = mockAppValues;
const gameValues = mockGameValues;

describe('RejoinForm', () => {
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
  test('renders the form correctly', () => {
    renderWithGameContext(appValues, socketValues, gameValues, <RejoinForm />)
    
    // Check if the form elements are rendered correctly
    expect(screen.getByPlaceholderText('Your Name')).toBeInTheDocument();
    expect(screen.getByText('Rejoin Game')).toBeInTheDocument();
  });

  test('enables the button when game is available', () => {
    renderWithGameContext(appValues, socketValues, gameValues, <RejoinForm />)
    // Check if the button is enabled when game is available
    const button = screen.getByRole('button', { name: 'Rejoin Game' });
    expect(button).toBeEnabled();
  });

  test('disables the button when game is not available', () => {
    socketValues.game = null;
    renderWithGameContext(appValues, socketValues, gameValues, <RejoinForm />)
    
    // Check if the button is disabled when game is not available
    const button = screen.getByRole('button', { name: 'Rejoin Game' });
    expect(button).toBeDisabled();
  });
});