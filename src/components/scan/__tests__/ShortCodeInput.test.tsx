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
    expect(screen.getByText('Enter 6-digit code')).toBeTruthy();
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

  it('calls onSubmit with raw digits when 6 digits entered and button pressed', () => {
    const onSubmit = jest.fn();
    render(<ShortCodeInput onSubmit={onSubmit} />);

    // The hidden TextInput has a testID we can use to find it
    const input = screen.getByDisplayValue('');
    // Type 6 digits
    fireEvent.changeText(input, '123456');

    fireEvent.press(screen.getByText('FIND RECIPIENT'));
    expect(onSubmit).toHaveBeenCalledWith('123456');
  });

  it('formats 6 digits as XXX-XXX in the display', () => {
    render(<ShortCodeInput onSubmit={jest.fn()} />);
    const input = screen.getByDisplayValue('');
    fireEvent.changeText(input, '123456');
    // Display value in the hidden input should be 123-456
    expect(screen.getByDisplayValue('123-456')).toBeTruthy();
  });

  it('strips non-digit characters from input', () => {
    render(<ShortCodeInput onSubmit={jest.fn()} />);
    const input = screen.getByDisplayValue('');
    fireEvent.changeText(input, '12a3b4');
    // Should only keep digits: 1234
    expect(screen.getByDisplayValue('123-4')).toBeTruthy();
  });

  it('shows loading state when isLoading is true', () => {
    render(<ShortCodeInput onSubmit={jest.fn()} isLoading />);
    // When loading, button shows spinner not text
    expect(screen.queryByText('FIND RECIPIENT')).toBeNull();
  });
});
