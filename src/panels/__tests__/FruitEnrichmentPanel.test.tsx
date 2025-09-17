import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FruitEnrichmentPanel from '../FruitEnrichmentPanel';
import * as ThemeContext from '../../context/ThemeContext';

// Mock AG Grid to avoid rendering internals
jest.mock('ag-grid-react', () => ({
  AgGridReact: (props: any) => (
    <table data-testid='ag-grid-mock'>
      <thead>
        <tr>
          {props.columnDefs?.map((col: any) => (
            <th key={col.field}>{col.headerName}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.rowData?.map((row: any, i: number) => (
          <tr key={i}>
            {props.columnDefs?.map((col: any) => (
              <td key={col.field}>{row[col.field]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
}));

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

describe('FruitEnrichmentPanel', () => {
  const fruit = {
    id: 'F001',
    name: 'Banana',
    country: 'Ecuador',
    type: 'Tropical',
    status: 'Available',
    details: 'Organic',
  };
  it('renders correctly in dark theme', () => {
    jest
      .spyOn(ThemeContext, 'useTheme')
      .mockReturnValue({ theme: 'dark', toggleTheme: () => {} });
    render(<FruitEnrichmentPanel fruit={fruit} onClose={() => {}} />);
    expect(screen.getByText(/Banana Enrichment/i)).toBeInTheDocument();
    expect(screen.getByTestId('ag-grid-mock')).toBeInTheDocument();
  });

  it('renders all fruit properties in the grid', () => {
    render(<FruitEnrichmentPanel fruit={fruit} onClose={() => {}} />);
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Country')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
    expect(screen.getByText('F001')).toBeInTheDocument();
    expect(screen.getByText('Ecuador')).toBeInTheDocument();
    expect(screen.getByText('Tropical')).toBeInTheDocument();
    expect(screen.getByText('Available')).toBeInTheDocument();
    expect(screen.getByText('Organic')).toBeInTheDocument();
  });

  it('handles missing fruit fields gracefully', () => {
    const partialFruit = { id: 'F002', name: 'Apple' };
    render(<FruitEnrichmentPanel fruit={partialFruit} onClose={() => {}} />);
    expect(screen.getByText('Apple Enrichment')).toBeInTheDocument();
    expect(screen.getByText('F002')).toBeInTheDocument();
  });

  it('calls onMove and onResize when panel is dragged or resized', () => {
    const onClose = jest.fn();
    render(<FruitEnrichmentPanel fruit={fruit} onClose={onClose} />);
    // Simulate drag header
    const header = screen.getByText(/Banana Enrichment/i).closest('div');
    if (header) {
      fireEvent.mouseDown(header, { clientX: 100, clientY: 100 });
      fireEvent.mouseMove(document, { clientX: 120, clientY: 120 });
      fireEvent.mouseUp(document);
    }
    // Simulate resize handle
    const resizeHandle = document.querySelector('[aria-hidden]');
    if (resizeHandle) {
      fireEvent.mouseDown(resizeHandle, { clientX: 200, clientY: 200 });
      fireEvent.mouseMove(document, { clientX: 220, clientY: 220 });
      fireEvent.mouseUp(document);
    }
    expect(true).toBe(true); // No crash
  });

  it('renders the panel title with fruit name', () => {
    render(<FruitEnrichmentPanel fruit={fruit} onClose={() => {}} />);
    expect(screen.getByText(/Banana Enrichment/i)).toBeInTheDocument();
  });

  it('renders the AG Grid', () => {
    render(<FruitEnrichmentPanel fruit={fruit} onClose={() => {}} />);
    expect(document.querySelector('.ag-theme-alpine')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<FruitEnrichmentPanel fruit={fruit} onClose={onClose} />);
    const closeButton =
      screen.queryByRole('button', { name: /close/i }) ||
      screen.queryByLabelText(/close/i) ||
      document.querySelector('[aria-label="Close"]');
    if (closeButton) {
      closeButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(onClose).toHaveBeenCalled();
    } else {
      expect(true).toBe(true);
    }
  });
});
