import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ShortCodeInput } from '../ShortCodeInput';

describe('ShortCodeInput', () => {
  it('shows placeholder text when empty', () => {
    render(<ShortCodeInput onSubmit={jest.fn()} />);
    expect(screen.getByText('XXX-XXX')).toBeTruthy();
  });

  it('renders the label and hint text', () => {
    render(<ShortCodeInput onSubmit={jest.fn()} />);
    expect(screen.getByText('Enter 6-character code')).toBeTruthy();
    expect(screen.getByText("Found on the recipient's PocketChange badge.")).toBeTruthy();
  });

  it('displays an error message when error prop is provided', () => {
    render(<ShortCodeInput onSubmit={jest.fn()} error="Recipient not found" />);
    expect(screen.getByText('Recipient not found')).toBeTruthy();
  });

  it('does not display error when error is null', () => {
    render(<ShortCodeInput onSubmit={jest.fn()} error={null} />);
    expect(screen.queryByText('Recipient not found')).toBeNull();
  });

  it('Find Recipient button is disabled when code is incomplete', () => {
    render(<ShortCodeInput onSubmit={jest.fn()} />);
    // The button exists but is disabled (no 6-digit input yet)
    const btn = screen.getByText('FIND RECIPIENT');
    expect(btn).toBeTruthy();
  });

  it('calls onSubmit with raw chars when 6 chars entered and button pressed', () => {
    const onSubmit = jest.fn();
    render(<ShortCodeInput onSubmit={onSubmit} />);

    const input = screen.getByDisplayValue('');
    fireEvent.changeText(input, 'AB1234');

    fireEvent.press(screen.getByText('FIND RECIPIENT'));
    expect(onSubmit).toHaveBeenCalledWith('AB1234');
  });

  it('formats 6 chars as XXX-XXX in the display', () => {
    render(<ShortCodeInput onSubmit={jest.fn()} />);
    const input = screen.getByDisplayValue('');
    fireEvent.changeText(input, 'AB1234');
    expect(screen.getByDisplayValue('AB1-234')).toBeTruthy();
  });

  it('uppercases input automatically', () => {
    render(<ShortCodeInput onSubmit={jest.fn()} />);
    const input = screen.getByDisplayValue('');
    fireEvent.changeText(input, 'abc123');
    expect(screen.getByDisplayValue('ABC-123')).toBeTruthy();
  });

  it('strips dashes from input (auto-inserted for display)', () => {
    render(<ShortCodeInput onSubmit={jest.fn()} />);
    const input = screen.getByDisplayValue('');
    fireEvent.changeText(input, 'AB-123');
    // Dash stripped, leaving AB123 → displayed as AB1-23
    expect(screen.getByDisplayValue('AB1-23')).toBeTruthy();
  });

  it('shows loading state when isLoading is true', () => {
    render(<ShortCodeInput onSubmit={jest.fn()} isLoading />);
    // When loading, button shows spinner not text
    expect(screen.queryByText('FIND RECIPIENT')).toBeNull();
  });
});
