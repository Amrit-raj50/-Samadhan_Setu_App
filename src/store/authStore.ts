/**
 * Samadhan Setu — Auth Store (Zustand)
 * Manages user authentication state, JWT token, and profile.
 * Automatically synchronizes JWT token with Axios API service.
 */
import { create } from 'zustand';
import { setAuthToken } from '../services/api';

export interface User {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  district?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  role: 'citizen' | 'admin' | 'university' | 'industry';
  avatar?: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isGuest: boolean;

  // Actions
  setUser: (user: User) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setGuest: (guest: boolean) => void;
  updateProfile: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isGuest: false,

  setUser: (user) => set({ user }),

  setToken: (token) => {
    setAuthToken(token);
    set({ token, isAuthenticated: Boolean(token) });
  },

  login: (user, token) => {
    setAuthToken(token);
    set({
      user,
      token,
      isAuthenticated: true,
      isGuest: false,
    });
  },

  logout: () => {
    setAuthToken(null);
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isGuest: false,
    });
  },

  setLoading: (isLoading) => set({ isLoading }),
  setGuest: (isGuest) => set({ isGuest }),

  updateProfile: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),
}));
