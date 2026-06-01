const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

async function profileRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}/api/profile${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? 'Request failed');
  return data;
}

export interface UserProfile {
  _id: string;
  name: string;
  username?: string;
  email: string;
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
  isAccountVerified: boolean;
  createdAt: string;
}

export const profileService = {
  searchProfiles: (q: string) =>
    profileRequest<{ success: boolean; users: UserProfile[] }>(`/search?q=${encodeURIComponent(q)}`),

  getMyProfile: () =>
    profileRequest<{ success: boolean; user: UserProfile }>('/me'),

  updateProfile: (data: Partial<UserProfile>) =>
    profileRequest<{ success: boolean; user: UserProfile }>('/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getPublicProfile: (username: string) =>
    profileRequest<{ success: boolean; user: UserProfile }>(`/${username}`),
};
