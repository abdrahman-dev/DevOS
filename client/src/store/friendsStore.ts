import { create } from 'zustand';
import { friendsService, type FriendUser, type FriendRequestType } from '../services/friends';

interface FriendsState {
  friends: FriendUser[];
  pending: FriendRequestType[];
  loading: boolean;
  loadFriends: () => Promise<void>;
  loadPending: () => Promise<void>;
  sendRequest: (userId: string) => Promise<void>;
  respond: (requestId: string, action: 'accept' | 'reject') => Promise<void>;
  remove: (userId: string) => Promise<void>;
}

export const useFriendsStore = create<FriendsState>((set, get) => ({
  friends: [],
  pending: [],
  loading: false,

  loadFriends: async () => {
    const res = await friendsService.getFriends();
    set({ friends: res.friends });
  },

  loadPending: async () => {
    const res = await friendsService.getPending();
    set({ pending: res.requests });
  },

  sendRequest: async (userId) => {
    await friendsService.send(userId);
  },

  respond: async (requestId, action) => {
    await friendsService.respond(requestId, action);
    await get().loadPending();
    await get().loadFriends();
  },

  remove: async (userId) => {
    await friendsService.remove(userId);
    await get().loadFriends();
  },
}));
