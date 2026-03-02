// Mock expo-secure-store before importing the store
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  setItemAsync: jest.fn(() => Promise.resolve()),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
}));

import { useAuthStore } from '../auth.store';

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useAuthStore.setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      _hasHydrated: false,
    });
  });

  it('has correct initial state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state._hasHydrated).toBe(false);
  });

  describe('setAuth', () => {
    it('sets user, accessToken and refreshToken', () => {
      const user = { id: 'u1', email: 'test@example.com', role: 'DONOR' as const, walletBalance: 0 };

      useAuthStore.getState().setAuth(user, 'access-123', 'refresh-456');

      const state = useAuthStore.getState();
      expect(state.user).toEqual(user);
      expect(state.accessToken).toBe('access-123');
      expect(state.refreshToken).toBe('refresh-456');
    });
  });

  describe('clearAuth', () => {
    it('resets user, accessToken and refreshToken to null', () => {
      const user = { id: 'u1', email: 'test@example.com', role: 'DONOR' as const, walletBalance: 0 };
      useAuthStore.getState().setAuth(user, 'access-123', 'refresh-456');

      useAuthStore.getState().clearAuth();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
    });
  });

  describe('setHasHydrated', () => {
    it('updates _hasHydrated', () => {
      useAuthStore.getState().setHasHydrated(true);
      expect(useAuthStore.getState()._hasHydrated).toBe(true);

      useAuthStore.getState().setHasHydrated(false);
      expect(useAuthStore.getState()._hasHydrated).toBe(false);
    });
  });
});
