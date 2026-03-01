import api from '@/lib/api';

export const donationService = {
  /**
   * Donate to a recipient using the raw QR token from a camera scan.
   * Calls the existing POST /recipients/scan endpoint.
   */
  async donateByToken(token: string, amountPence: number): Promise<void> {
    await api.post('/recipients/scan', { token, amount: amountPence });
  },

  /**
   * Donate to a recipient using their ID (for short-code initiated donations).
   * Requires backend endpoint: POST /recipients/:id/donate { amount }
   */
  async donateById(recipientId: string, amountPence: number): Promise<void> {
    await api.post(`/recipients/${recipientId}/donate`, { amount: amountPence });
  },
};
