import { recipientService } from '../recipient.service';

jest.mock('@/lib/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

import api from '@/lib/api';

const mockApi = api as jest.Mocked<typeof api>;

const mockLookup = {
  id: 'rec-1',
  firstName: 'John',
  lastName: 'Smith',
  nickname: null,
  shortCode: '123456',
  status: 'ACTIVE' as const,
  balance: 750,
};

describe('recipientService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('lookupByToken', () => {
    it('calls GET /recipients/lookup with encoded token', async () => {
      mockApi.get.mockResolvedValueOnce({ data: mockLookup });

      const result = await recipientService.lookupByToken('token abc');

      expect(mockApi.get).toHaveBeenCalledWith('/recipients/lookup?token=token%20abc');
      expect(result).toEqual(mockLookup);
    });
  });

  describe('lookupByShortCode', () => {
    it('strips dashes and calls GET /recipients/by-shortcode/:code', async () => {
      mockApi.get.mockResolvedValueOnce({ data: mockLookup });

      await recipientService.lookupByShortCode('123-456');

      expect(mockApi.get).toHaveBeenCalledWith('/recipients/by-shortcode/123456');
    });

    it('works with code that already has no dash', async () => {
      mockApi.get.mockResolvedValueOnce({ data: mockLookup });

      await recipientService.lookupByShortCode('123456');

      expect(mockApi.get).toHaveBeenCalledWith('/recipients/by-shortcode/123456');
    });
  });

  describe('getPublicProfile', () => {
    it('calls GET /recipients/:id/public-profile', async () => {
      const mockProfile = {
        id: 'rec-1',
        displayName: 'John S.',
        status: 'ACTIVE' as const,
        totalRaisedPence: 5000,
        donorCount: 12,
        recentActivity: [],
      };
      mockApi.get.mockResolvedValueOnce({ data: mockProfile });

      const result = await recipientService.getPublicProfile('rec-1');

      expect(mockApi.get).toHaveBeenCalledWith('/recipients/rec-1/public-profile');
      expect(result).toEqual(mockProfile);
    });
  });
});
