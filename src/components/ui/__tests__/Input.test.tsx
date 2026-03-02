import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Input } from '../Input';

describe('Input', () => {
  it('renders without label', () => {
    const { toJSON } = render(<Input value="" onChangeText={jest.fn()} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders the label when provided', () => {
    render(<Input label="Email" value="" onChangeText={jest.fn()} />);
    expect(screen.getByText('Email')).toBeTruthy();
  });

  it('shows error message when error prop is provided', () => {
    render(<Input value="" onChangeText={jest.fn()} error="Email is required" />);
    expect(screen.getByText('Email is required')).toBeTruthy();
  });

  it('does not show error message when error is undefined', () => {
    render(<Input value="" onChangeText={jest.fn()} />);
    expect(screen.queryByText('Email is required')).toBeNull();
  });

  it('calls onChangeText when text changes', () => {
    const onChangeText = jest.fn();
    render(<Input value="" onChangeText={onChangeText} placeholder="type here" />);
    fireEvent.changeText(screen.getByPlaceholderText('type here'), 'hello');
    expect(onChangeText).toHaveBeenCalledWith('hello');
  });

  it('renders the placeholder', () => {
    render(<Input value="" onChangeText={jest.fn()} placeholder="Enter email" />);
    expect(screen.getByPlaceholderText('Enter email')).toBeTruthy();
  });
});
