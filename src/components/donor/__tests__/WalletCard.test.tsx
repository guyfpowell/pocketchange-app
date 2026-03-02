import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { WalletCard, WalletCardSkeleton } from '../WalletCard';

describe('WalletCard', () => {
  it('displays the formatted balance', () => {
    render(<WalletCard balancePence={2550} onTopUp={jest.fn()} onScan={jest.fn()} />);
    expect(screen.getByText('£25.50')).toBeTruthy();
  });

  it('displays £0.00 for zero balance', () => {
    render(<WalletCard balancePence={0} onTopUp={jest.fn()} onScan={jest.fn()} />);
    expect(screen.getByText('£0.00')).toBeTruthy();
  });

  it('calls onTopUp when Top Up button is pressed', () => {
    const onTopUp = jest.fn();
    render(<WalletCard balancePence={1000} onTopUp={onTopUp} onScan={jest.fn()} />);
    fireEvent.press(screen.getByText('TOP UP'));
    expect(onTopUp).toHaveBeenCalledTimes(1);
  });

  it('calls onScan when Scan to Donate is pressed', () => {
    const onScan = jest.fn();
    render(<WalletCard balancePence={1000} onTopUp={jest.fn()} onScan={onScan} />);
    // The text is 'Scan to Donate' in the source; textTransform: uppercase is CSS-only
    fireEvent.press(screen.getByText('Scan to Donate'));
    expect(onScan).toHaveBeenCalledTimes(1);
  });

  it('shows "WALLET BALANCE" label', () => {
    render(<WalletCard balancePence={500} onTopUp={jest.fn()} onScan={jest.fn()} />);
    expect(screen.getByText('WALLET BALANCE')).toBeTruthy();
  });
});

describe('WalletCardSkeleton', () => {
  it('renders without throwing', () => {
    const { toJSON } = render(<WalletCardSkeleton />);
    expect(toJSON()).toBeTruthy();
  });
});
