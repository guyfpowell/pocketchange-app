import axios from 'axios';
import { useAuthStore } from '@/store/auth.store';

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000/api';

const api = axios.create({ baseURL: BASE_URL });

// ─── Request: inject Bearer token ────────────────────────────────────────────
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// ─── Response: on 401 → refresh once → retry → clear session ─────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as typeof error.config & { _retry?: boolean };

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const { refreshToken, user, setAuth } = useAuthStore.getState();

        const { data } = await axios.post<{ accessToken: string }>(
          `${BASE_URL}/auth/refresh`,
          { refreshToken }
        );

        if (user) {
          setAuth(user, data.accessToken, refreshToken ?? '');
        }

        original.headers = {
          ...original.headers,
          Authorization: `Bearer ${data.accessToken}`,
        };

        return api(original);
      } catch {
        useAuthStore.getState().clearAuth();
        // Root layout reacts to cleared auth state and redirects to sign-in
      }
    }

    return Promise.reject(error);
  }
);

export default api;
