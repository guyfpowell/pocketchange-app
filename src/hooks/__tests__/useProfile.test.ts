import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useProfile } from '../useProfile';
import { userService } from '@/services/user.service';

jest.mock('@/services/user.service', () => ({
  userService: {
    getMe: jest.fn(),
  },
}));

const mockUserService = userService as jest.Mocked<typeof userService>;

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useProfile', () => {
  beforeEach(() => jest.clearAllMocks());

  it('fetches the current user profile', async () => {
    const mockProfile = {
      id: 'user-1',
      email: 'donor@example.com',
      role: 'DONOR' as const,
      walletBalance: 2000,
      active: true,
      createdAt: '2024-01-01T00:00:00Z',
      totalDonatedPence: 5000,
    };
    mockUserService.getMe.mockResolvedValueOnce(mockProfile);

    const { result } = renderHook(() => useProfile(), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockProfile);
    expect(mockUserService.getMe).toHaveBeenCalledTimes(1);
  });

  it('handles a fetch error gracefully', async () => {
    mockUserService.getMe.mockRejectedValueOnce(new Error('Unauthorized'));

    const { result } = renderHook(() => useProfile(), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
