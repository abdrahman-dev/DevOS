import { create } from 'zustand';
import { authService } from '../services/auth';
import type { AuthUser } from '../types';

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  initialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  initialized: false,

  checkAuth: async () => {
    try {
      const res = await authService.me();
      set({ user: res.user, initialized: true });
    } catch {
      set({ user: null, initialized: true });
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await authService.login(email, password);
      set({ user: res.user ?? null });
    } finally {
      set({ loading: false });
    }
  },

  register: async (name, email, password) => {
    set({ loading: true });
    try {
      await authService.register(name, email, password);
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    await authService.logout();
    set({ user: null });
  },
}));
