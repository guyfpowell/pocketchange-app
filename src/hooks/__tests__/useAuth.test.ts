import { renderHook, waitFor, act } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useLogin, useLogout, useRegister } from '../useAuth';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';

jest.mock('@/services/auth.service', () => ({
  authService: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
  },
}));

// Mock expo-secure-store for zustand persist
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  setItemAsync: jest.fn(() => Promise.resolve()),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

const mockAuthService = authService as jest.Mocked<typeof authService>;

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({ user: null, accessToken: null, refreshToken: null, _hasHydrated: false });
  });

  it('calls authService.login with credentials', async () => {
    mockAuthService.login.mockResolvedValueOnce({
      user: { id: 'u1', email: 'donor@example.com', role: 'DONOR', walletBalance: 0 },
      tokens: { accessToken: 'acc', refreshToken: 'ref' },
    });

    const { result } = renderHook(() => useLogin(), { wrapper: makeWrapper() });

    act(() => {
      result.current.mutate({ email: 'donor@example.com', password: 'pass' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockAuthService.login).toHaveBeenCalledWith({
      email: 'donor@example.com',
      password: 'pass',
    });
  });

  it('stores auth in the store on success', async () => {
    const user = { id: 'u1', email: 'donor@example.com', role: 'DONOR' as const, walletBalance: 0 };
    mockAuthService.login.mockResolvedValueOnce({
      user,
      tokens: { accessToken: 'access-token', refreshToken: 'refresh-token' },
    });

    const { result } = renderHook(() => useLogin(), { wrapper: makeWrapper() });

    act(() => {
      result.current.mutate({ email: 'donor@example.com', password: 'pass' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(useAuthStore.getState().accessToken).toBe('access-token');
    expect(useAuthStore.getState().user?.id).toBe('u1');
  });
});

describe('useRegister', () => {
  beforeEach(() => jest.clearAllMocks());

  it('calls authService.register', async () => {
    mockAuthService.register.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useRegister(), { wrapper: makeWrapper() });

    act(() => {
      result.current.mutate({ email: 'new@example.com', password: 'password' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockAuthService.register).toHaveBeenCalledWith({
      email: 'new@example.com',
      password: 'password',
    });
  });
});

describe('useLogout', () => {
  beforeEach(() => jest.clearAllMocks());

  it('clears auth store after logout', async () => {
    const user = { id: 'u1', email: 'donor@example.com', role: 'DONOR' as const, walletBalance: 0 };
    useAuthStore.getState().setAuth(user, 'access', 'refresh');

    mockAuthService.logout.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useLogout(), { wrapper: makeWrapper() });

    act(() => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().accessToken).toBeNull();
  });

  it('clears auth even when server call fails', async () => {
    const user = { id: 'u1', email: 'donor@example.com', role: 'DONOR' as const, walletBalance: 0 };
    useAuthStore.getState().setAuth(user, 'access', 'refresh');

    mockAuthService.logout.mockRejectedValueOnce(new Error('Server error'));

    const { result } = renderHook(() => useLogout(), { wrapper: makeWrapper() });

    act(() => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isError || result.current.isSuccess).toBe(true));
    // clearAuth is called in onSettled which runs regardless
    expect(useAuthStore.getState().user).toBeNull();
  });
});
