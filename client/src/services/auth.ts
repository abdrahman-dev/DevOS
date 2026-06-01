const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  username?: string;
  bio?: string;
  avatar?: string;
  location?: string;
  website?: string;
  socials?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    devto?: string;
  };
  isProfilePublic: boolean;
  isVerified: boolean;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  message?: string;
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}/api/auth${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? 'Request failed');
  return data;
}

export const authService = {
  register: (name: string, email: string, password: string) =>
    request<AuthResponse>('/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    request<AuthResponse>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    request<AuthResponse>('/logout', { method: 'POST' }),

  me: () =>
    request<AuthResponse & { user: AuthUser }>('/me'),

  verifyEmail: (email: string, otp: string) =>
    request<AuthResponse>('/verify-email', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    }),

  resendOtp: (email: string) =>
    request<AuthResponse>('/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  forgotPassword: (email: string) =>
    request<AuthResponse>('/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (email: string, otp: string, newPassword: string) =>
    request<AuthResponse>('/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, otp, newPassword }),
    }),
};
