import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import AboutPanel from '../AboutPanel';

// Mock window.matchMedia for Ant Design components
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

describe('AboutPanel', () => {
  it('renders About panel', () => {
    render(<AboutPanel />);
    expect(screen.getByText(/About/i)).toBeInTheDocument();
  });

  it('shows the playful trading app message', () => {
    render(<AboutPanel />);
    expect(
      screen.getAllByText((_, node) =>
        node?.textContent?.includes(
          'This is a playful trading app for fruit, built with React.'
        )
      )
    ).toBeTruthy();
  });
});
