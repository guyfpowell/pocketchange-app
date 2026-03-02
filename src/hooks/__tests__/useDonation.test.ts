import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useDonationHistory, useSpendBreakdown } from '../useDonation';
import { donationService } from '@/services/donation.service';

jest.mock('@/services/donation.service', () => ({
  donationService: {
    getDonationHistory: jest.fn(),
    getSpendBreakdown: jest.fn(),
  },
}));

const mockDonationService = donationService as jest.Mocked<typeof donationService>;

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useDonationHistory', () => {
  beforeEach(() => jest.clearAllMocks());

  it('fetches first page of donation history', async () => {
    const mockPage = {
      donations: [
        { id: 'don-1', amountPence: 500, createdAt: '2024-01-01T00:00:00Z', recipientName: 'John S.', recipientId: 'rec-1' },
      ],
      total: 1,
      page: 1,
      limit: 20,
    };
    mockDonationService.getDonationHistory.mockResolvedValueOnce(mockPage);

    const { result } = renderHook(() => useDonationHistory(), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.pages[0]).toEqual(mockPage);
    expect(mockDonationService.getDonationHistory).toHaveBeenCalledWith(1, 20);
  });

  it('getNextPageParam returns undefined when all pages loaded', async () => {
    const mockPage = { donations: [{ id: 'd1', amountPence: 100, createdAt: '2024-01-01T00:00:00Z', recipientName: null, recipientId: null }], total: 1, page: 1, limit: 20 };
    mockDonationService.getDonationHistory.mockResolvedValueOnce(mockPage);

    const { result } = renderHook(() => useDonationHistory(), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.hasNextPage).toBe(false);
  });
});

describe('useSpendBreakdown', () => {
  beforeEach(() => jest.clearAllMocks());

  it('fetches spend breakdown for a donation', async () => {
    const mockBreakdown = {
      donationId: 'don-1',
      totalPence: 500,
      spentPence: 300,
      remainingPence: 200,
      redemptions: [{ vendorName: 'Greggs', amountPence: 300, date: '2024-01-15', partial: false }],
    };
    mockDonationService.getSpendBreakdown.mockResolvedValueOnce(mockBreakdown);

    const { result } = renderHook(() => useSpendBreakdown('don-1'), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockBreakdown);
    expect(mockDonationService.getSpendBreakdown).toHaveBeenCalledWith('don-1');
  });

  it('is disabled when donationId is empty string', () => {
    const { result } = renderHook(() => useSpendBreakdown(''), { wrapper: makeWrapper() });

    expect(result.current.fetchStatus).toBe('idle');
    expect(mockDonationService.getSpendBreakdown).not.toHaveBeenCalled();
  });
});
