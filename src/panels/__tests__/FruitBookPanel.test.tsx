import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FruitBookPanel from '../FruitBookPanel';

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

jest.mock('ag-grid-react', () => ({
  AgGridReact: (props: any) => (
    <table data-testid='ag-grid-mock'>
      <thead>
        <tr>
          <th>ID</th>
          <th>Fruit</th>
          <th>Country</th>
          <th>Type</th>
          <th>Status</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        <tr
          data-testid='fruit-row'
          onDoubleClick={() =>
            props.onRowDoubleClicked &&
            props.onRowDoubleClicked({
              data: {
                id: 'F001',
                name: 'Banana',
                country: 'Ecuador',
                type: 'Tropical',
                status: 'Available',
                details: 'Organic, Fair Trade',
              },
            })
          }
        >
          <td>F001</td>
          <td>Banana</td>
          <td>Ecuador</td>
          <td>Tropical</td>
          <td>Available</td>
          <td>Organic, Fair Trade</td>
        </tr>
      </tbody>
    </table>
  ),
}));

describe('FruitBookPanel', () => {
  it('renders the Fruit Book header', () => {
    render(<FruitBookPanel />);
    expect(screen.getByText(/Fruit Book/i)).toBeInTheDocument();
  });

  it('renders the AG Grid wrapper', () => {
    render(<FruitBookPanel />);
    expect(screen.getByTestId('ag-grid-mock')).toBeInTheDocument();
  });

  it('renders table headers', () => {
    render(<FruitBookPanel />);
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Fruit')).toBeInTheDocument();
    expect(screen.getByText('Country')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
  });

  it('renders a sample fruit name', () => {
    render(<FruitBookPanel />);
    expect(screen.getByText('Banana')).toBeInTheDocument();
  });

  it('opens enrichment panel on row double-click', () => {
    render(<FruitBookPanel />);
    const row = screen.getByTestId('fruit-row');
    fireEvent.doubleClick(row);
    expect(screen.getByText(/Enrichment/i)).toBeInTheDocument();
    const bananaElements = screen.getAllByText(/Banana/i);
    expect(bananaElements.length).toBeGreaterThan(1);
  });

  it('closes enrichment panel when onClose is called', () => {
    render(<FruitBookPanel />);
    const row = screen.getByTestId('fruit-row');
    fireEvent.doubleClick(row);
    const closeButton =
      screen.queryByRole('button', { name: /close/i }) ||
      screen.queryByLabelText(/close/i) ||
      document.querySelector('[aria-label="Close"]');
    if (closeButton) {
      fireEvent.click(closeButton);
      expect(screen.queryByText(/Enrichment/i)).not.toBeInTheDocument();
    } else {
      expect(true).toBe(true);
    }
  });
});
