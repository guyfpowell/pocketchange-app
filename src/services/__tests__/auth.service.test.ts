import { authService } from '../auth.service';

// Mock the API module
jest.mock('@/lib/api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

import api from '@/lib/api';

const mockApi = api as jest.Mocked<typeof api>;

/** Build a minimal JWT with a given payload for testing. */
function makeJwt(payload: object): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${header}.${body}.signature`;
}

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('calls POST /auth/login with credentials', async () => {
      const token = makeJwt({ sub: 'user-1', role: 'DONOR' });
      mockApi.post.mockResolvedValueOnce({
        data: { accessToken: token, refreshToken: 'refresh-abc' },
      });

      await authService.login({ email: 'donor@example.com', password: 'pass123' });

      expect(mockApi.post).toHaveBeenCalledWith('/auth/login', {
        email: 'donor@example.com',
        password: 'pass123',
      });
    });

    it('parses the JWT and returns the correct user', async () => {
      const token = makeJwt({ sub: 'user-42', role: 'DONOR' });
      mockApi.post.mockResolvedValueOnce({
        data: { accessToken: token, refreshToken: 'refresh-abc' },
      });

      const result = await authService.login({ email: 'donor@example.com', password: 'pass' });

      expect(result.user.id).toBe('user-42');
      expect(result.user.role).toBe('DONOR');
      expect(result.user.email).toBe('donor@example.com');
      expect(result.user.walletBalance).toBe(0);
      expect(result.tokens.accessToken).toBe(token);
      expect(result.tokens.refreshToken).toBe('refresh-abc');
    });
  });

  describe('register', () => {
    it('calls POST /auth/register with role DONOR', async () => {
      mockApi.post.mockResolvedValueOnce({ data: {} });

      await authService.register({ email: 'new@example.com', password: 'password' });

      expect(mockApi.post).toHaveBeenCalledWith('/auth/register', {
        email: 'new@example.com',
        password: 'password',
        role: 'DONOR',
      });
    });
  });

  describe('logout', () => {
    it('calls POST /auth/logout', async () => {
      mockApi.post.mockResolvedValueOnce({ data: {} });

      await authService.logout();

      expect(mockApi.post).toHaveBeenCalledWith('/auth/logout');
    });
  });

  describe('refresh', () => {
    it('calls POST /auth/refresh with the refresh token', async () => {
      mockApi.post.mockResolvedValueOnce({ data: { accessToken: 'new-token' } });

      const result = await authService.refresh('refresh-token-123');

      expect(mockApi.post).toHaveBeenCalledWith('/auth/refresh', {
        refreshToken: 'refresh-token-123',
      });
      expect(result.accessToken).toBe('new-token');
    });
  });
});
