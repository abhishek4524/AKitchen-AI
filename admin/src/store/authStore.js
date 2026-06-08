import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Decode JWT payload without verifying signature (for expiry check only)
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp && payload.exp * 1000 < Date.now();
  } catch {
    return true; // treat invalid token as expired
  }
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (userData, token) => set({ user: userData, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      // Call this once on app mount to clear stale expired tokens
      checkAuth: () => {
        const { token } = get();
        if (token && isTokenExpired(token)) {
          set({ user: null, token: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'admin-auth-storage',
    }
  )
);
