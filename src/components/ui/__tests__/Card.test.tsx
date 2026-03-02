import React from 'react';
import { Text } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { Card } from '../Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card><Text>Hello card</Text></Card>);
    expect(screen.getByText('Hello card')).toBeTruthy();
  });

  it('renders without throwing when no padding override provided', () => {
    const { toJSON } = render(<Card><Text>content</Text></Card>);
    expect(toJSON()).toBeTruthy();
  });

  it('accepts a custom padding prop', () => {
    const { toJSON } = render(<Card padding={8}><Text>tight</Text></Card>);
    expect(toJSON()).toBeTruthy();
  });
});
