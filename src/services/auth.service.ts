import api from '@/lib/api';
import type { AuthUser } from '@/store/auth.store';

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

/** Decode JWT payload without external libs — works in RN 0.76+ (atob is global). */
function decodeJwtPayload(token: string): { sub: string; role: string } {
  const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(atob(base64)) as { sub: string; role: string };
}

export const authService = {
  async login(input: LoginInput): Promise<{ user: AuthUser; tokens: TokenResponse }> {
    const { data } = await api.post<TokenResponse>('/auth/login', input);
    const payload = decodeJwtPayload(data.accessToken);
    const user: AuthUser = {
      id: payload.sub,
      email: input.email,
      role: payload.role as AuthUser['role'],
      walletBalance: 0,
    };
    return { user, tokens: data };
  },

  async register(input: RegisterInput): Promise<void> {
    // Register always creates a DONOR in this app — role is fixed server-side
    // if the endpoint requires it, or omitted if the backend defaults to DONOR.
    await api.post('/auth/register', { ...input, role: 'DONOR' });
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    const { data } = await api.post<{ accessToken: string }>('/auth/refresh', {
      refreshToken,
    });
    return data;
  },
};
