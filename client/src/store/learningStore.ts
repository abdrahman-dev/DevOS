import { create } from 'zustand';
import type { LearningItem } from '../types';
import * as db from '../db';

interface LearningState {
  items: LearningItem[];
  loading: boolean;
  loadItems: () => Promise<void>;
  addItem: (item: LearningItem) => Promise<void>;
  updateItem: (item: LearningItem) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
}

export const useLearningStore = create<LearningState>((set, get) => ({
  items: [],
  loading: false,
  async loadItems() {
    set({ loading: true });
    const items = await db.getAllLearning();
    set({ items, loading: false });
  },
  async addItem(item) {
    await db.addLearning(item);
    set({ items: [...get().items, item] });
  },
  async updateItem(item) {
    await db.updateLearning(item);
    set({ items: get().items.map((x) => (x.id === item.id ? item : x)) });
  },
  async deleteItem(id) {
    await db.deleteLearning(id);
    set({ items: get().items.filter((x) => x.id !== id) });
  },
}));
