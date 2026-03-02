import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useRecipientProfile } from '../useRecipient';
import { recipientService } from '@/services/recipient.service';

jest.mock('@/services/recipient.service', () => ({
  recipientService: {
    getPublicProfile: jest.fn(),
  },
}));

const mockRecipientService = recipientService as jest.Mocked<typeof recipientService>;

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useRecipientProfile', () => {
  beforeEach(() => jest.clearAllMocks());

  it('fetches a recipient public profile by id', async () => {
    const mockProfile = {
      id: 'rec-1',
      displayName: 'John S.',
      status: 'ACTIVE' as const,
      totalRaisedPence: 10000,
      donorCount: 5,
      recentActivity: [{ date: '2024-01-10', amountPence: 500 }],
    };
    mockRecipientService.getPublicProfile.mockResolvedValueOnce(mockProfile);

    const { result } = renderHook(() => useRecipientProfile('rec-1'), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockProfile);
    expect(mockRecipientService.getPublicProfile).toHaveBeenCalledWith('rec-1');
  });

  it('is disabled when id is empty', () => {
    const { result } = renderHook(() => useRecipientProfile(''), { wrapper: makeWrapper() });

    expect(result.current.fetchStatus).toBe('idle');
    expect(mockRecipientService.getPublicProfile).not.toHaveBeenCalled();
  });
});
