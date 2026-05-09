export type ProjectStatus = 'active' | 'learning' | 'paused' | 'completed' | 'idea';
export type ProjectPriority = 'low' | 'medium' | 'high';
export type LearningStatus = 'active' | 'paused' | 'completed';
export type Theme = 'dark' | 'light';
export type ToastType = 'success' | 'error' | 'info';

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
  openRouterApiKey?: string;
  openRouterModel?: string;
  githubUsername?: string;
  vercelApiToken?: string;
  vercelTeamId?: string;
  ollamaBaseUrl?: string;
  wakatimeApiKey?: string;
  railwayToken?: string;
  renderApiKey?: string;
  supabaseToken?: string;
  devtoApiKey?: string;
}

export interface IntegrationStatus {
  github: boolean;
  openrouter: boolean;
  vercel: boolean;
  ollama: boolean;
  wakatime: boolean;
  railway: boolean;
  render: boolean;
  supabase: boolean;
  devto: boolean;
}

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export interface GitHubWidgetData {
  avatar: string;
  name: string;
  publicRepos: number;
  followers: number;
  topRepos: { name: string; stars: number; language: string }[];
}

export interface OpenRouterWidgetData {
  label: string;
  usage: number;
  limit: number;
  isFreeTier: boolean;
}

export interface VercelWidgetData {
  name: string;
  projects: number;
  deployments: number;
}

export interface OllamaWidgetData {
  version: string;
  models: number;
}

export interface WakaTimeWidgetData {
  username: string;
  totalCodingTime: string;
  topLanguage: string;
  topLanguagePercent: number;
}

export interface RailwayWidgetData {
  name: string;
  projects: number;
}

export interface RenderWidgetData {
  name: string;
  services: number;
}

export interface SupabaseWidgetData {
  orgName: string;
  projects: number;
}

export interface DevToWidgetData {
  username: string;
  articles: number;
  totalReactions: number;
}

export interface WidgetDataMap {
  github?: GitHubWidgetData;
  openrouter?: OpenRouterWidgetData;
  vercel?: VercelWidgetData;
  ollama?: OllamaWidgetData;
  wakatime?: WakaTimeWidgetData;
  railway?: RailwayWidgetData;
  render?: RenderWidgetData;
  supabase?: SupabaseWidgetData;
  devto?: DevToWidgetData;
}
