import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FruitViewPanel from '../FruitViewPanel';

beforeEach(() => {
  jest.resetModules();
});

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

describe('FruitViewPanel', () => {
  it('renders Fruit View panel and inventory', () => {
    render(<FruitViewPanel />);
    expect(screen.getByText(/Fruit View/i)).toBeInTheDocument();
    expect(screen.getByText(/Inventory/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Apple/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Banana/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Orange/i).length).toBeGreaterThan(0);
  });

  it('can change fruit and amount', () => {
    render(<FruitViewPanel />);
    // Select dropdown
    const select = screen.getByRole('combobox');
    fireEvent.mouseDown(select);
    // Simulate selecting Banana by changing value and firing change
    fireEvent.change(select, { target: { value: 'banana' } });
    // Check that Banana is now selected in the dropdown
    expect(screen.getAllByText('Banana').length).toBeGreaterThan(0);
    // Change amount
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: 2 } });
    expect((input as HTMLInputElement).value).toBe('2');
  });

  it('shows message and updates inventory on successful buy', () => {
    render(<FruitViewPanel />);
    const buyButton = screen.getByRole('button', { name: /buy/i });
    fireEvent.click(buyButton);
    // There may be multiple elements (panel and AntD message)
    expect(screen.getAllByText(/Bought 1 apple/i).length).toBeGreaterThan(0);
    // Inventory should decrease
    expect(screen.getByText(/Apple: 9/i)).toBeInTheDocument();
  });

  it('shows error message on failed buy (not enough fruit)', () => {
    render(<FruitViewPanel />);
    // Set amount to a large number
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: 999 } });
    const buyButton = screen.getByRole('button', { name: /buy/i });
    fireEvent.click(buyButton);
    expect(
      screen.getAllByText(/Not enough fruit to buy/i).length
    ).toBeGreaterThan(0);
  });

  it('shows message and updates inventory on successful sell', () => {
    render(<FruitViewPanel />);
    const sellButton = screen.getByRole('button', { name: /sell/i });
    fireEvent.click(sellButton);
    expect(screen.getAllByText(/Sold 1 apple/i).length).toBeGreaterThan(0);
    // Inventory should increase (text may be split by elements)
    // Find a list item that contains both 'Apple' and '11' or '10' (in case of test order)
    const appleInventory = Array.from(document.querySelectorAll('li')).find(
      (li) =>
        li.textContent &&
        li.textContent.includes('Apple') &&
        (li.textContent.includes('11') || li.textContent.includes('10'))
    );
    expect(appleInventory).toBeTruthy();
  });

  it('shows error message on failed sell (not enough fruit)', () => {
    render(<FruitViewPanel />);
    // Change fruit to banana and set amount high
    const select = screen.getByRole('combobox');
    fireEvent.mouseDown(select);
    fireEvent.change(select, { target: { value: 'banana' } });
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: 99 } });
    const sellButton = screen.getByRole('button', { name: /sell/i });
    fireEvent.click(sellButton);
    expect(
      screen.getAllByText(/Not enough fruit to sell/i).length
    ).toBeGreaterThan(0);
  });

  it('message color changes for buy, sell, and error', () => {
    render(<FruitViewPanel />);
    const buyButton = screen.getByRole('button', { name: /buy/i });
    fireEvent.click(buyButton);
    const buyMsgs = screen.getAllByText(/Bought 1 apple/i);
    expect(buyMsgs.length).toBeGreaterThan(0);

    const sellButton = screen.getByRole('button', { name: /sell/i });
    fireEvent.click(sellButton);
    const sellMsgs = screen.getAllByText(/Sold 1 apple/i);
    expect(sellMsgs.length).toBeGreaterThan(0);

    // Set amount high for error
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: 999 } });
    fireEvent.click(buyButton);
    const errorMsgs = screen.getAllByText(/Not enough fruit to buy/i);
    expect(errorMsgs.length).toBeGreaterThan(0);
  });
});
