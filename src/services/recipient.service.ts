import api from '@/lib/api';

export interface RecipientLookup {
  id: string;
  firstName: string;
  lastName: string;
  nickname: string | null;
  shortCode: string;
  status: 'ACTIVE' | 'SUSPENDED';
  balance: number;
}

export const recipientService = {
  /** Look up a recipient by the raw QR token string. */
  async lookupByToken(token: string): Promise<RecipientLookup> {
    const { data } = await api.get<RecipientLookup>(
      `/recipients/lookup?token=${encodeURIComponent(token)}`
    );
    return data;
  },

  /** Look up a recipient by their 6-digit short code (with or without dash). */
  async lookupByShortCode(code: string): Promise<RecipientLookup> {
    const clean = code.replace(/-/g, '');
    const { data } = await api.get<RecipientLookup>(
      `/recipients/by-shortcode/${clean}`
    );
    return data;
  },
};
