export type ProjectStatus = 'active' | 'learning' | 'paused' | 'completed' | 'idea';
export type ProjectPriority = 'low' | 'medium' | 'high';
export type LearningStatus = 'active' | 'paused' | 'completed';
export type Theme = 'dark' | 'light';
export type ToastType = 'success' | 'error' | 'info';
export type AuthStep = 'login' | 'register' | 'verify-email' | 'forgot-password' | 'reset-password';

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

export interface Project {
  id: string;
  name: string;
  description: string;
  githubUrl?: string;
  liveUrl?: string;
  tags: string[];
  status: ProjectStatus;
  priority: ProjectPriority;
  startedAt: string;
  updatedAt: string;
  notes?: string;
}

export interface LearningItem {
  id: string;
  topic: string;
  source?: string;
  progress: number;
  status: LearningStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  theme: Theme;
  githubUsername?: string;
}

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export interface GitHubWidgetData {
  user: {
    avatar_url: string;
    login: string;
    name: string;
    public_repos: number;
    followers: number;
  };
  repos: {
    id: number;
    name: string;
    language: string | null;
    stargazers_count: number;
    updated_at: string;
    html_url: string;
  }[];
}

export interface WidgetDataMap {
  github?: GitHubWidgetData;
}
