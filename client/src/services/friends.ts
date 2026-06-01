const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

async function friendRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}/api/friends${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? 'Request failed');
  return data;
}

export const friendsService = {
  send: (userId: string) =>
    friendRequest(`/request/${userId}`, { method: 'POST' }),
  respond: (requestId: string, action: 'accept' | 'reject') =>
    friendRequest(`/request/${requestId}`, {
      method: 'PUT',
      body: JSON.stringify({ action }),
    }),
  getFriends: () =>
    friendRequest<{ success: boolean; friends: FriendUser[] }>('/'),
  getPending: () =>
    friendRequest<{ success: boolean; requests: FriendRequestType[] }>('/pending'),
  remove: (userId: string) =>
    friendRequest(`/${userId}`, { method: 'DELETE' }),
};

export interface FriendUser {
  _id: string;
  name: string;
  username?: string;
  avatar?: string;
}

export interface FriendRequestType {
  _id: string;
  from: FriendUser;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}
