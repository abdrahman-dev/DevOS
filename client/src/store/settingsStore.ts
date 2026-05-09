import { create } from 'zustand';
import type { Settings } from '../types';
import * as db from '../db';

interface SettingsState {
  settings: Settings;
  loading: boolean;
  loadSettings: () => Promise<void>;
  saveSettings: (s: Settings) => Promise<void>;
}

function applyTheme(theme: string): void {
  const root = document.documentElement;
  root.classList.remove('theme-dark', 'theme-light');
  root.classList.add(`theme-${theme}`);
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: { theme: 'dark' },
  loading: false,
  async loadSettings() {
    set({ loading: true });
    const settings = await db.getSettings();
    applyTheme(settings.theme);
    set({ settings, loading: false });
  },
  async saveSettings(s) {
    await db.saveSettings(s);
    applyTheme(s.theme);
    set({ settings: s });
  },
}));
