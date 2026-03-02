import { userService } from '../user.service';

jest.mock('@/lib/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

import api from '@/lib/api';

const mockApi = api as jest.Mocked<typeof api>;

describe('userService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMe', () => {
    it('calls GET /users/me and returns user profile', async () => {
      const mockProfile = {
        id: 'user-1',
        email: 'donor@example.com',
        role: 'DONOR' as const,
        walletBalance: 1500,
        active: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        totalDonatedPence: 3000,
      };
      mockApi.get.mockResolvedValueOnce({ data: mockProfile });

      const result = await userService.getMe();

      expect(mockApi.get).toHaveBeenCalledWith('/users/me');
      expect(result).toEqual(mockProfile);
    });
  });
});
