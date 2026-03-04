import { walletService } from '../wallet.service';

jest.mock('@/lib/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

import api from '@/lib/api';

const mockApi = api as jest.Mocked<typeof api>;

describe('walletService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getBalance', () => {
    it('calls GET /users/me/wallet and returns balance', async () => {
      mockApi.get.mockResolvedValueOnce({ data: { walletBalance: 2500 } });

      const result = await walletService.getBalance();

      expect(mockApi.get).toHaveBeenCalledWith('/users/me/wallet');
      expect(result.walletBalance).toBe(2500);
    });
  });

  describe('createTopUp', () => {
    it('calls POST /users/me/wallet/topup with amount in pence', async () => {
      mockApi.post.mockResolvedValueOnce({ data: { clientSecret: 'pi_secret_abc' } });

      const result = await walletService.createTopUp(1000);

      expect(mockApi.post).toHaveBeenCalledWith('/users/me/wallet/topup', { amount: 1000 });
      expect(result.clientSecret).toBe('pi_secret_abc');
    });
  });

  describe('getTransactions', () => {
    it('calls GET /users/me/transactions and remaps data → transactions', async () => {
      // Backend returns { data: [...] } — service remaps to { transactions: [...] }
      mockApi.get.mockResolvedValueOnce({ data: { data: [], total: 0, page: 1, limit: 20 } });

      const result = await walletService.getTransactions();

      expect(mockApi.get).toHaveBeenCalledWith('/users/me/transactions?page=1&limit=20');
      expect(result).toEqual({ transactions: [], total: 0, page: 1, limit: 20 });
    });

    it('calls with custom page and limit', async () => {
      mockApi.get.mockResolvedValueOnce({ data: { data: [], total: 0, page: 2, limit: 5 } });

      const result = await walletService.getTransactions(2, 5);

      expect(mockApi.get).toHaveBeenCalledWith('/users/me/transactions?page=2&limit=5');
      expect(result.transactions).toEqual([]);
    });
  });
});
