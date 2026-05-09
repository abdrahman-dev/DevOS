import { create } from 'zustand';
import type { Project } from '../types';
import * as db from '../db';

interface ProjectsState {
  projects: Project[];
  loading: boolean;
  loadProjects: () => Promise<void>;
  addProject: (p: Project) => Promise<void>;
  updateProject: (p: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  loading: false,
  async loadProjects() {
    set({ loading: true });
    const projects = await db.getAllProjects();
    set({ projects, loading: false });
  },
  async addProject(p) {
    await db.addProject(p);
    set({ projects: [...get().projects, p] });
  },
  async updateProject(p) {
    await db.updateProject(p);
    set({ projects: get().projects.map((x) => (x.id === p.id ? p : x)) });
  },
  async deleteProject(id) {
    await db.deleteProject(id);
    set({ projects: get().projects.filter((x) => x.id !== id) });
  },
}));
