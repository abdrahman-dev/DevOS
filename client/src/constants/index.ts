import type { ProjectStatus, ProjectPriority, LearningStatus } from '../types';

export const PROJECT_STATUSES: { value: ProjectStatus; label: string; color: string }[] = [
  { value: 'active', label: 'Active', color: 'var(--success)' },
  { value: 'learning', label: 'Learning', color: 'var(--accent)' },
  { value: 'paused', label: 'Paused', color: 'var(--warning)' },
  { value: 'completed', label: 'Completed', color: 'var(--text-2)' },
  { value: 'idea', label: 'Idea', color: 'var(--purple)' },
];

export const PROJECT_PRIORITIES: { value: ProjectPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export const LEARNING_STATUSES: { value: LearningStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' },
];

export const ROUTES = {
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  PROJECT_DETAIL: '/projects/:id',
  LEARNING: '/learning',
  SETTINGS: '/settings',
} as const;

export const DEFAULT_SETTINGS = { theme: 'dark' as const };
