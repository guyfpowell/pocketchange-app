import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Badge } from '../Badge';

describe('Badge', () => {
  it('renders the label in uppercase', () => {
    render(<Badge label="success" variant="success" />);
    expect(screen.getByText('SUCCESS')).toBeTruthy();
  });

  it('renders all four variants without throwing', () => {
    const variants = ['success', 'warning', 'error', 'info'] as const;
    variants.forEach((variant) => {
      const { unmount } = render(<Badge label={variant} variant={variant} />);
      expect(screen.getByText(variant.toUpperCase())).toBeTruthy();
      unmount();
    });
  });

  it('renders with mixed case label', () => {
    render(<Badge label="In Progress" variant="info" />);
    expect(screen.getByText('IN PROGRESS')).toBeTruthy();
  });
});
