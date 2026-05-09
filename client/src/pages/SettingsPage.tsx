import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Upload, AlertTriangle, CheckCircle, XCircle, ExternalLink, Users, BookOpen, Server, Cpu, Globe, GitBranch, Clock, Zap, Cloud, Database, Terminal } from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';
import { useProjectsStore } from '../store/projectsStore';
import { useLearningStore } from '../store/learningStore';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ui/Toast';
import StatusBadge from '../components/ui/StatusBadge';
import IntegrationCard from '../components/cards/IntegrationCard';
import { downloadJson } from '../utils';
import { fetchOpenRouterUsage } from '../services/openrouter';
import { fetchGitHubUser } from '../services/github';
import { fetchVercelUser, fetchVercelProjects } from '../services/vercel';
import { fetchOllamaStatus, fetchOllamaModels } from '../services/ollama';
import { fetchWakaTimeUser, fetchWakaTimeStats } from '../services/wakatime';
import { fetchRailwayUser, fetchRailwayProjects } from '../services/railway';
import { fetchRenderUser, fetchRenderServices } from '../services/render';
import { fetchSupabaseProjects, fetchSupabaseOrgs } from '../services/supabase';
import { fetchDevToUser, fetchDevToArticles } from '../services/devto';

type Tab = 'general' | 'integrations' | 'data';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const tabs: { key: Tab; label: string }[] = [
  { key: 'general', label: 'General' },
  { key: 'integrations', label: 'Integrations' },
  { key: 'data', label: 'Data' },
];

interface OrInfo {
  label: string;
  usage: number;
  limit: number;
  isFreeTier: boolean;
}

interface GhInfo {
  avatar: string;
  name: string;
  publicRepos: number;
  followers: number;
}

interface VercelInfo {
  name: string;
  projects: number;
}

interface OllamaInfo {
  version: string;
  models: number;
}

interface WakaTimeInfo {
  username: string;
  totalCodingTime: string;
  topLanguage: string;
  topLanguagePercent: number;
}

interface RailwayInfo {
  name: string;
  projects: number;
}

interface RenderInfo {
  name: string;
  services: number;
}

interface SupabaseInfo {
  orgName: string;
  projects: number;
}

interface DevToInfo {
  username: string;
  articles: number;
  totalReactions: number;
}

export default function SettingsPage() {
  const { settings, saveSettings } = useSettingsStore();
  const projects = useProjectsStore((s) => s.projects);
  const loadProjects = useProjectsStore((s) => s.loadProjects);
  const learningItems = useLearningStore((s) => s.items);
  const loadItems = useLearningStore((s) => s.loadItems);
  const { toasts, showToast, removeToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('general');

  // OpenRouter state
  const [apiKey, setApiKey] = useState(settings.openRouterApiKey ?? '');
  const [apiModel, setApiModel] = useState(settings.openRouterModel ?? '');
  const [orInfo, setOrInfo] = useState<OrInfo | null>(null);
  const [orLoading, setOrLoading] = useState(false);
  const [orError, setOrError] = useState('');

  // GitHub state
  const [ghUsername, setGhUsername] = useState(settings.githubUsername ?? '');
  const [ghInfo, setGhInfo] = useState<GhInfo | null>(null);
  const [ghLoading, setGhLoading] = useState(false);
  const [ghError, setGhError] = useState('');

  // Vercel / Ollama state
  const [configuring, setConfiguring] = useState<'vercel' | 'ollama' | 'openrouter' | 'github' | 'wakatime' | 'railway' | 'render' | 'supabase' | 'devto' | null>(null);
  const [vercelToken, setVercelToken] = useState(settings.vercelApiToken ?? '');
  const [vercelTeamId, setVercelTeamId] = useState(settings.vercelTeamId ?? '');
  const [vercelInfo, setVercelInfo] = useState<VercelInfo | null>(null);
  const [vercelLoading, setVercelLoading] = useState(false);
  const [vercelError, setVercelError] = useState('');
  const [ollamaUrl, setOllamaUrl] = useState(settings.ollamaBaseUrl ?? '');
  const [ollamaInfo, setOllamaInfo] = useState<OllamaInfo | null>(null);
  const [ollamaLoading, setOllamaLoading] = useState(false);
  const [ollamaError, setOllamaError] = useState('');

  // WakaTime state
  const [wakatimeApiKey, setWakaTimeApiKey] = useState(settings.wakatimeApiKey ?? '');
  const [wakatimeInfo, setWakaTimeInfo] = useState<WakaTimeInfo | null>(null);
  const [wakatimeLoading, setWakaTimeLoading] = useState(false);
  const [wakatimeError, setWakaTimeError] = useState('');

  // Railway state
  const [railwayToken, setRailwayToken] = useState(settings.railwayToken ?? '');
  const [railwayInfo, setRailwayInfo] = useState<RailwayInfo | null>(null);
  const [railwayLoading, setRailwayLoading] = useState(false);
  const [railwayError, setRailwayError] = useState('');

  // Render state
  const [renderApiKey, setRenderApiKey] = useState(settings.renderApiKey ?? '');
  const [renderInfo, setRenderInfo] = useState<RenderInfo | null>(null);
  const [renderLoading, setRenderLoading] = useState(false);
  const [renderError, setRenderError] = useState('');

  // Supabase state
  const [supabaseToken, setSupabaseToken] = useState(settings.supabaseToken ?? '');
  const [supabaseInfo, setSupabaseInfo] = useState<SupabaseInfo | null>(null);
  const [supabaseLoading, setSupabaseLoading] = useState(false);
  const [supabaseError, setSupabaseError] = useState('');

  // DEV.to state
  const [devtoApiKey, setDevToApiKey] = useState(settings.devtoApiKey ?? '');
  const [devtoInfo, setDevToInfo] = useState<DevToInfo | null>(null);
  const [devtoLoading, setDevToLoading] = useState(false);
  const [devtoError, setDevToError] = useState('');

  useEffect(() => {
    document.title = 'Settings — DevOS';
  }, []);

  const handleThemeChange = (theme: 'dark' | 'light') => {
    saveSettings({ ...settings, theme });
    showToast(`Theme set to ${theme}`, 'info');
  };

  const handleSaveApi = async () => {
    setOrLoading(true);
    setOrError('');
    setOrInfo(null);
    try {
      const data = await fetchOpenRouterUsage(apiKey);
      setOrInfo({
        label: data.label ?? data.key?.label ?? 'OpenRouter Key',
        usage: data.usage ?? data.key?.usage ?? 0,
        limit: data.limit ?? data.key?.limit ?? 0,
        isFreeTier: data.is_free_tier ?? data.key?.is_free_tier ?? false,
      });
      await saveSettings({ ...settings, openRouterApiKey: apiKey, openRouterModel: apiModel });
      setConfiguring(null);
      showToast('API key verified and saved', 'success');
    } catch {
      setOrError('Invalid API key or network error');
      showToast('Failed to verify API key', 'error');
    } finally {
      setOrLoading(false);
    }
  };

  const handleOpenRouterDisconnect = async () => {
    await saveSettings({ ...settings, openRouterApiKey: undefined, openRouterModel: undefined });
    setApiKey('');
    setApiModel('');
    setOrInfo(null);
    setOrError('');
    showToast('OpenRouter disconnected', 'info');
  };

  const handleSaveGitHub = async () => {
    if (!ghUsername.trim()) return;
    setGhLoading(true);
    setGhError('');
    setGhInfo(null);
    try {
      const user = await fetchGitHubUser(ghUsername.trim());
      setGhInfo({
        avatar: user.avatar_url,
        name: user.name ?? user.login,
        publicRepos: user.public_repos,
        followers: user.followers,
      });
      await saveSettings({ ...settings, githubUsername: ghUsername.trim() });
      setConfiguring(null);
      showToast('GitHub profile connected', 'success');
    } catch {
      setGhError('User not found');
      showToast('GitHub user not found', 'error');
    } finally {
      setGhLoading(false);
    }
  };

  const handleGitHubDisconnect = async () => {
    await saveSettings({ ...settings, githubUsername: undefined });
    setGhUsername('');
    setGhInfo(null);
    setGhError('');
    showToast('GitHub disconnected', 'info');
  };

  // Vercel handlers
  const handleSaveVercel = async () => {
    if (!vercelToken.trim()) return;
    setVercelLoading(true);
    setVercelError('');
    setVercelInfo(null);
    try {
      const user = await fetchVercelUser(vercelToken.trim());
      const projectsRes = await fetchVercelProjects(vercelToken.trim(), vercelTeamId.trim() || undefined);
      setVercelInfo({
        name: user.user?.name ?? user.user?.username ?? 'Vercel User',
        projects: projectsRes.projects?.length ?? 0,
      });
      await saveSettings({
        ...settings,
        vercelApiToken: vercelToken.trim(),
        vercelTeamId: vercelTeamId.trim() || undefined,
      });
      setConfiguring(null);
      showToast('Vercel connected', 'success');
    } catch {
      setVercelError('Invalid token or network error');
      showToast('Failed to verify Vercel token', 'error');
    } finally {
      setVercelLoading(false);
    }
  };

  const handleVercelDisconnect = async () => {
    await saveSettings({ ...settings, vercelApiToken: undefined, vercelTeamId: undefined });
    setVercelToken('');
    setVercelTeamId('');
    setVercelInfo(null);
    setVercelError('');
    showToast('Vercel disconnected', 'info');
  };

  // Ollama handlers
  const handleSaveOllama = async () => {
    if (!ollamaUrl.trim()) return;
    setOllamaLoading(true);
    setOllamaError('');
    setOllamaInfo(null);
    try {
      const version = await fetchOllamaStatus(ollamaUrl.trim());
      const models = await fetchOllamaModels(ollamaUrl.trim());
      setOllamaInfo({
        version: version.version ?? 'unknown',
        models: models.models?.length ?? 0,
      });
      await saveSettings({ ...settings, ollamaBaseUrl: ollamaUrl.trim() });
      setConfiguring(null);
      showToast('Ollama connected', 'success');
    } catch {
      setOllamaError('Could not reach Ollama');
      showToast('Failed to connect to Ollama', 'error');
    } finally {
      setOllamaLoading(false);
    }
  };

  const handleOllamaDisconnect = async () => {
    await saveSettings({ ...settings, ollamaBaseUrl: undefined });
    setOllamaUrl('');
    setOllamaInfo(null);
    setOllamaError('');
    showToast('Ollama disconnected', 'info');
  };

  // WakaTime handlers
  const handleSaveWakaTime = async () => {
    if (!wakatimeApiKey.trim()) return;
    setWakaTimeLoading(true);
    setWakaTimeError('');
    setWakaTimeInfo(null);
    try {
      const user = await fetchWakaTimeUser(wakatimeApiKey.trim());
      const stats = await fetchWakaTimeStats(wakatimeApiKey.trim());
      setWakaTimeInfo({
        username: user.data?.username ?? user.data?.display_name ?? 'WakaTime User',
        totalCodingTime: stats.data?.human_readable_total ?? 'N/A',
        topLanguage: stats.data?.languages?.[0]?.name ?? 'N/A',
        topLanguagePercent: stats.data?.languages?.[0]?.percent ?? 0,
      });
      await saveSettings({ ...settings, wakatimeApiKey: wakatimeApiKey.trim() });
      setConfiguring(null);
      showToast('WakaTime connected', 'success');
    } catch {
      setWakaTimeError('Invalid API key or network error');
      showToast('Failed to verify WakaTime API key', 'error');
    } finally {
      setWakaTimeLoading(false);
    }
  };

  const handleWakaTimeDisconnect = async () => {
    await saveSettings({ ...settings, wakatimeApiKey: undefined });
    setWakaTimeApiKey('');
    setWakaTimeInfo(null);
    setWakaTimeError('');
    showToast('WakaTime disconnected', 'info');
  };

  // Railway handlers
  const handleSaveRailway = async () => {
    if (!railwayToken.trim()) return;
    setRailwayLoading(true);
    setRailwayError('');
    setRailwayInfo(null);
    try {
      const user = await fetchRailwayUser(railwayToken.trim());
      const projects = await fetchRailwayProjects(railwayToken.trim());
      setRailwayInfo({
        name: user.name ?? user.email ?? 'Railway User',
        projects: projects.length,
      });
      await saveSettings({ ...settings, railwayToken: railwayToken.trim() });
      setConfiguring(null);
      showToast('Railway connected', 'success');
    } catch {
      setRailwayError('Invalid token or network error');
      showToast('Failed to verify Railway token', 'error');
    } finally {
      setRailwayLoading(false);
    }
  };

  const handleRailwayDisconnect = async () => {
    await saveSettings({ ...settings, railwayToken: undefined });
    setRailwayToken('');
    setRailwayInfo(null);
    setRailwayError('');
    showToast('Railway disconnected', 'info');
  };

  // Render handlers
  const handleSaveRender = async () => {
    if (!renderApiKey.trim()) return;
    setRenderLoading(true);
    setRenderError('');
    setRenderInfo(null);
    try {
      const user = await fetchRenderUser(renderApiKey.trim());
      const services = await fetchRenderServices(renderApiKey.trim());
      setRenderInfo({
        name: user?.name ?? user?.email ?? 'Render User',
        services: services.length,
      });
      await saveSettings({ ...settings, renderApiKey: renderApiKey.trim() });
      setConfiguring(null);
      showToast('Render connected', 'success');
    } catch {
      setRenderError('Invalid API key or network error');
      showToast('Failed to verify Render API key', 'error');
    } finally {
      setRenderLoading(false);
    }
  };

  const handleRenderDisconnect = async () => {
    await saveSettings({ ...settings, renderApiKey: undefined });
    setRenderApiKey('');
    setRenderInfo(null);
    setRenderError('');
    showToast('Render disconnected', 'info');
  };

  // Supabase handlers
  const handleSaveSupabase = async () => {
    if (!supabaseToken.trim()) return;
    setSupabaseLoading(true);
    setSupabaseError('');
    setSupabaseInfo(null);
    try {
      const orgs = await fetchSupabaseOrgs(supabaseToken.trim());
      const projects = await fetchSupabaseProjects(supabaseToken.trim());
      setSupabaseInfo({
        orgName: orgs[0]?.name ?? 'Supabase User',
        projects: projects.length,
      });
      await saveSettings({ ...settings, supabaseToken: supabaseToken.trim() });
      setConfiguring(null);
      showToast('Supabase connected', 'success');
    } catch {
      setSupabaseError('Invalid token or network error');
      showToast('Failed to verify Supabase token', 'error');
    } finally {
      setSupabaseLoading(false);
    }
  };

  const handleSupabaseDisconnect = async () => {
    await saveSettings({ ...settings, supabaseToken: undefined });
    setSupabaseToken('');
    setSupabaseInfo(null);
    setSupabaseError('');
    showToast('Supabase disconnected', 'info');
  };

  // DEV.to handlers
  const handleSaveDevTo = async () => {
    if (!devtoApiKey.trim()) return;
    setDevToLoading(true);
    setDevToError('');
    setDevToInfo(null);
    try {
      const user = await fetchDevToUser(devtoApiKey.trim());
      const articles = await fetchDevToArticles(devtoApiKey.trim());
      const totalReactions = articles.reduce((sum: number, a: any) => sum + (a.positive_reactions_count ?? 0), 0);
      setDevToInfo({
        username: user.username ?? user.name ?? 'DEV User',
        articles: articles.length,
        totalReactions,
      });
      await saveSettings({ ...settings, devtoApiKey: devtoApiKey.trim() });
      setConfiguring(null);
      showToast('DEV.to connected', 'success');
    } catch {
      setDevToError('Invalid API key or network error');
      showToast('Failed to verify DEV.to API key', 'error');
    } finally {
      setDevToLoading(false);
    }
  };

  const handleDevToDisconnect = async () => {
    await saveSettings({ ...settings, devtoApiKey: undefined });
    setDevToApiKey('');
    setDevToInfo(null);
    setDevToError('');
    showToast('DEV.to disconnected', 'info');
  };

  // Data handlers
  const handleExport = () => {
    const data = { projects, learning: learningItems, settings, exportedAt: new Date().toISOString() };
    downloadJson(data, `devos-export-${Date.now()}.json`);
    showToast('Data exported', 'success');
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!data.projects || !data.learning || !data.settings) {
        showToast('Invalid export file', 'error');
        return;
      }
      const { saveSettings: saveS } = useSettingsStore.getState();
      const { addProject } = useProjectsStore.getState();
      const { addItem } = useLearningStore.getState();
      await saveS(data.settings);
      for (const p of data.projects) await addProject(p);
      for (const l of data.learning) await addItem(l);
      await loadProjects();
      await loadItems();
      await useSettingsStore.getState().loadSettings();
      showToast('Data imported successfully', 'success');
    } catch {
      showToast('Failed to import file', 'error');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClearAll = async () => {
    const { deleteProject } = useProjectsStore.getState();
    const { deleteItem } = useLearningStore.getState();
    for (const p of projects) await deleteProject(p.id);
    for (const l of learningItems) await deleteItem(l.id);
    await loadProjects();
    await loadItems();
    setConfirmClear(false);
    showToast('All data cleared', 'info');
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.18, ease: 'easeOut' }}
      style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 640 }}
    >
      <h2 style={{ fontSize: 20 }}>Settings</h2>

      <div style={{ display: 'flex', gap: 4, background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', padding: 4 }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1,
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              background: activeTab === tab.key ? 'var(--accent)' : 'transparent',
              color: activeTab === tab.key ? '#fff' : 'var(--text-2)',
              border: 'none',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              transition: 'background 0.2s, color 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'general' && (
        <section style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, color: 'var(--text-2)', letterSpacing: '0.05em' }}>Theme</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => handleThemeChange('dark')} style={{
              flex: 1, padding: '10px 16px', borderRadius: 'var(--radius-sm)',
              background: settings.theme === 'dark' ? 'var(--accent)' : 'var(--surface-2)',
              color: settings.theme === 'dark' ? '#fff' : 'var(--text)',
              border: '1.5px solid transparent', fontWeight: 600, fontSize: 13, cursor: 'pointer',
            }}>Dark</button>
            <button onClick={() => handleThemeChange('light')} style={{
              flex: 1, padding: '10px 16px', borderRadius: 'var(--radius-sm)',
              background: settings.theme === 'light' ? 'var(--accent)' : 'var(--surface-2)',
              color: settings.theme === 'light' ? '#fff' : 'var(--text)',
              border: '1.5px solid transparent', fontWeight: 600, fontSize: 13, cursor: 'pointer',
            }}>Light</button>
          </div>
        </section>
      )}

      {activeTab === 'integrations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* GitHub */}
          <IntegrationCard
            name="GitHub"
            description="Repositories, activity, and profile"
            icon={<GitBranch size={20} />}
            connected={!!settings.githubUsername}
            preview={ghInfo ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src={ghInfo.avatar} alt="" style={{ width: 28, height: 28, borderRadius: '50%', border: '1.5px solid var(--border)' }} />
                <span style={{ flex: 1 }}><strong>{ghInfo.name}</strong></span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><BookOpen size={11} /> {ghInfo.publicRepos}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={11} /> {ghInfo.followers}</span>
              </div>
            ) : settings.githubUsername ? (
              <span style={{ color: 'var(--text-2)' }}>Configured — verify by saving again</span>
            ) : undefined}
            onConfigure={() => {
              setGhUsername(settings.githubUsername ?? '');
              setConfiguring('github');
            }}
            onDisconnect={handleGitHubDisconnect}
          />
          {configuring === 'github' && (
            <div style={{ padding: 16, background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: 12, marginTop: -8 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>Username</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="text" value={ghUsername} onChange={(e) => setGhUsername(e.target.value)} placeholder="octocat" style={{ flex: 1 }} />
                  <button onClick={handleSaveGitHub} className="btn-primary" disabled={ghLoading} style={{ opacity: ghLoading ? 0.6 : 1, whiteSpace: 'nowrap' }}>
                    {ghLoading ? 'Loading…' : 'Connect'}
                  </button>
                </div>
              </div>
              {ghError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(248,113,113,0.08)', borderRadius: 'var(--radius-sm)' }}>
                  <XCircle size={16} style={{ color: 'var(--danger)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--danger)' }}>{ghError}</span>
                </div>
              )}
              {ghInfo && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(52,211,153,0.08)', borderRadius: 'var(--radius-sm)' }}>
                  <CheckCircle size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--success)' }}>Connected as {ghInfo.name}</span>
                </div>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setConfiguring(null)} className="btn-ghost">Cancel</button>
              </div>
            </div>
          )}

          {/* OpenRouter */}
          <IntegrationCard
            name="OpenRouter"
            description="AI model access and API management"
            icon={<Globe size={20} />}
            connected={!!settings.openRouterApiKey}
            preview={orInfo ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Key: {orInfo.label}</div>
                <div>
                  <div style={{ height: 6, background: 'var(--surface-3)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min((orInfo.usage / (orInfo.limit || 1)) * 100, 100)}%`, background: orInfo.usage >= orInfo.limit ? 'var(--danger)' : 'var(--accent)', borderRadius: 99, transition: 'width 0.3s' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-2)', marginTop: 3 }}>
                    <span>Used: {orInfo.usage.toLocaleString()}</span>
                    <span>Limit: {orInfo.limit.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ) : settings.openRouterApiKey ? (
              <span style={{ color: 'var(--text-2)' }}>Configured — verify by saving again</span>
            ) : undefined}
            onConfigure={() => {
              setApiKey(settings.openRouterApiKey ?? '');
              setApiModel(settings.openRouterModel ?? '');
              setConfiguring('openrouter');
            }}
            onDisconnect={handleOpenRouterDisconnect}
          />
          {configuring === 'openrouter' && (
            <div style={{ padding: 16, background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: 12, marginTop: -8 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>API Key</label>
                <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-or-…" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>Model</label>
                <input type="text" value={apiModel} onChange={(e) => setApiModel(e.target.value)} placeholder="openai/gpt-4o" />
              </div>
              {orError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(248,113,113,0.08)', borderRadius: 'var(--radius-sm)' }}>
                  <XCircle size={16} style={{ color: 'var(--danger)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--danger)' }}>{orError}</span>
                </div>
              )}
              {orInfo && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(52,211,153,0.08)', borderRadius: 'var(--radius-sm)' }}>
                  <CheckCircle size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--success)' }}>Connected — {orInfo.label}</span>
                </div>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleSaveApi} className="btn-primary" disabled={orLoading} style={{ opacity: orLoading ? 0.6 : 1 }}>
                  {orLoading ? 'Verifying…' : 'Save'}
                </button>
                <button onClick={() => setConfiguring(null)} className="btn-ghost">Cancel</button>
              </div>
            </div>
          )}

          {/* Vercel */}
          <IntegrationCard
            name="Vercel"
            description="Deployments, projects, and team management"
            icon={<Server size={20} />}
            connected={!!settings.vercelApiToken}
            preview={vercelInfo ? (
              <span>Connected as <strong>{vercelInfo.name}</strong> · {vercelInfo.projects} projects</span>
            ) : settings.vercelApiToken ? (
              <span style={{ color: 'var(--text-2)' }}>Configured — verify by saving again</span>
            ) : undefined}
            onConfigure={() => {
              setVercelToken(settings.vercelApiToken ?? '');
              setVercelTeamId(settings.vercelTeamId ?? '');
              setConfiguring('vercel');
            }}
            onDisconnect={handleVercelDisconnect}
          />
          {configuring === 'vercel' && (
            <div style={{ padding: 16, background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: 12, marginTop: -8 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>API Token</label>
                <input type="password" value={vercelToken} onChange={(e) => setVercelToken(e.target.value)} placeholder="vercel_xxx…" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>Team ID (optional)</label>
                <input type="text" value={vercelTeamId} onChange={(e) => setVercelTeamId(e.target.value)} placeholder="team_xxx" />
              </div>
              {vercelError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(248,113,113,0.08)', borderRadius: 'var(--radius-sm)' }}>
                  <XCircle size={16} style={{ color: 'var(--danger)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--danger)' }}>{vercelError}</span>
                </div>
              )}
              {vercelInfo && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(52,211,153,0.08)', borderRadius: 'var(--radius-sm)' }}>
                  <CheckCircle size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--success)' }}>Connected as {vercelInfo.name}</span>
                </div>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleSaveVercel} className="btn-primary" disabled={vercelLoading} style={{ opacity: vercelLoading ? 0.6 : 1 }}>
                  {vercelLoading ? 'Verifying…' : 'Save'}
                </button>
                <button onClick={() => setConfiguring(null)} className="btn-ghost">Cancel</button>
              </div>
            </div>
          )}

          {/* Ollama */}
          <IntegrationCard
            name="Ollama"
            description="Local LLM models via Ollama API"
            icon={<Cpu size={20} />}
            connected={!!settings.ollamaBaseUrl}
            preview={ollamaInfo ? (
              <span>Version <strong>{ollamaInfo.version}</strong> · {ollamaInfo.models} models</span>
            ) : settings.ollamaBaseUrl ? (
              <span style={{ color: 'var(--text-2)' }}>Configured — verify by saving again</span>
            ) : undefined}
            onConfigure={() => {
              setOllamaUrl(settings.ollamaBaseUrl ?? '');
              setConfiguring('ollama');
            }}
            onDisconnect={handleOllamaDisconnect}
          />
          {configuring === 'ollama' && (
            <div style={{ padding: 16, background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: 12, marginTop: -8 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>Base URL</label>
                <input type="text" value={ollamaUrl} onChange={(e) => setOllamaUrl(e.target.value)} placeholder="http://localhost:11434" />
              </div>
              {ollamaError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(248,113,113,0.08)', borderRadius: 'var(--radius-sm)' }}>
                  <XCircle size={16} style={{ color: 'var(--danger)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--danger)' }}>{ollamaError}</span>
                </div>
              )}
              {ollamaInfo && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(52,211,153,0.08)', borderRadius: 'var(--radius-sm)' }}>
                  <CheckCircle size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--success)' }}>Connected — {ollamaInfo.version}</span>
                </div>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleSaveOllama} className="btn-primary" disabled={ollamaLoading} style={{ opacity: ollamaLoading ? 0.6 : 1 }}>
                  {ollamaLoading ? 'Verifying…' : 'Save'}
                </button>
                <button onClick={() => setConfiguring(null)} className="btn-ghost">Cancel</button>
              </div>
            </div>
          )}

          {/* WakaTime */}
          <IntegrationCard
            name="WakaTime"
            description="Coding activity and time tracking"
            icon={<Clock size={20} />}
            connected={!!settings.wakatimeApiKey}
            preview={wakatimeInfo ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12 }}>
                <span><strong>{wakatimeInfo.username}</strong></span>
                <span style={{ color: 'var(--text-2)' }}>{wakatimeInfo.totalCodingTime} last 7 days</span>
                <span style={{ color: 'var(--text-2)' }}>Top: {wakatimeInfo.topLanguage} ({wakatimeInfo.topLanguagePercent}%)</span>
              </div>
            ) : settings.wakatimeApiKey ? (
              <span style={{ color: 'var(--text-2)' }}>Configured — verify by saving again</span>
            ) : undefined}
            onConfigure={() => {
              setWakaTimeApiKey(settings.wakatimeApiKey ?? '');
              setConfiguring('wakatime');
            }}
            onDisconnect={handleWakaTimeDisconnect}
          />
          {configuring === 'wakatime' && (
            <div style={{ padding: 16, background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: 12, marginTop: -8 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>API Key</label>
                <input type="password" value={wakatimeApiKey} onChange={(e) => setWakaTimeApiKey(e.target.value)} placeholder="waka_xxx…" />
              </div>
              {wakatimeError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(248,113,113,0.08)', borderRadius: 'var(--radius-sm)' }}>
                  <XCircle size={16} style={{ color: 'var(--danger)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--danger)' }}>{wakatimeError}</span>
                </div>
              )}
              {wakatimeInfo && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(52,211,153,0.08)', borderRadius: 'var(--radius-sm)' }}>
                  <CheckCircle size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--success)' }}>Connected as {wakatimeInfo.username}</span>
                </div>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleSaveWakaTime} className="btn-primary" disabled={wakatimeLoading} style={{ opacity: wakatimeLoading ? 0.6 : 1 }}>
                  {wakatimeLoading ? 'Verifying…' : 'Save'}
                </button>
                <button onClick={() => setConfiguring(null)} className="btn-ghost">Cancel</button>
              </div>
            </div>
          )}

          {/* Railway */}
          <IntegrationCard
            name="Railway"
            description="Cloud infrastructure and project management"
            icon={<Zap size={20} />}
            connected={!!settings.railwayToken}
            preview={railwayInfo ? (
              <span>Connected as <strong>{railwayInfo.name}</strong> · {railwayInfo.projects} projects</span>
            ) : settings.railwayToken ? (
              <span style={{ color: 'var(--text-2)' }}>Configured — verify by saving again</span>
            ) : undefined}
            onConfigure={() => {
              setRailwayToken(settings.railwayToken ?? '');
              setConfiguring('railway');
            }}
            onDisconnect={handleRailwayDisconnect}
          />
          {configuring === 'railway' && (
            <div style={{ padding: 16, background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: 12, marginTop: -8 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>Token</label>
                <input type="password" value={railwayToken} onChange={(e) => setRailwayToken(e.target.value)} placeholder="railway_xxx…" />
              </div>
              {railwayError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(248,113,113,0.08)', borderRadius: 'var(--radius-sm)' }}>
                  <XCircle size={16} style={{ color: 'var(--danger)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--danger)' }}>{railwayError}</span>
                </div>
              )}
              {railwayInfo && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(52,211,153,0.08)', borderRadius: 'var(--radius-sm)' }}>
                  <CheckCircle size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--success)' }}>Connected as {railwayInfo.name}</span>
                </div>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleSaveRailway} className="btn-primary" disabled={railwayLoading} style={{ opacity: railwayLoading ? 0.6 : 1 }}>
                  {railwayLoading ? 'Verifying…' : 'Save'}
                </button>
                <button onClick={() => setConfiguring(null)} className="btn-ghost">Cancel</button>
              </div>
            </div>
          )}

          {/* Render */}
          <IntegrationCard
            name="Render"
            description="Cloud hosting and web services"
            icon={<Cloud size={20} />}
            connected={!!settings.renderApiKey}
            preview={renderInfo ? (
              <span>Connected as <strong>{renderInfo.name}</strong> · {renderInfo.services} services</span>
            ) : settings.renderApiKey ? (
              <span style={{ color: 'var(--text-2)' }}>Configured — verify by saving again</span>
            ) : undefined}
            onConfigure={() => {
              setRenderApiKey(settings.renderApiKey ?? '');
              setConfiguring('render');
            }}
            onDisconnect={handleRenderDisconnect}
          />
          {configuring === 'render' && (
            <div style={{ padding: 16, background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: 12, marginTop: -8 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>API Key</label>
                <input type="password" value={renderApiKey} onChange={(e) => setRenderApiKey(e.target.value)} placeholder="rnd_xxx…" />
              </div>
              {renderError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(248,113,113,0.08)', borderRadius: 'var(--radius-sm)' }}>
                  <XCircle size={16} style={{ color: 'var(--danger)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--danger)' }}>{renderError}</span>
                </div>
              )}
              {renderInfo && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(52,211,153,0.08)', borderRadius: 'var(--radius-sm)' }}>
                  <CheckCircle size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--success)' }}>Connected as {renderInfo.name}</span>
                </div>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleSaveRender} className="btn-primary" disabled={renderLoading} style={{ opacity: renderLoading ? 0.6 : 1 }}>
                  {renderLoading ? 'Verifying…' : 'Save'}
                </button>
                <button onClick={() => setConfiguring(null)} className="btn-ghost">Cancel</button>
              </div>
            </div>
          )}

          {/* Supabase */}
          <IntegrationCard
            name="Supabase"
            description="Backend infrastructure and database management"
            icon={<Database size={20} />}
            connected={!!settings.supabaseToken}
            preview={supabaseInfo ? (
              <span><strong>{supabaseInfo.orgName}</strong> · {supabaseInfo.projects} projects</span>
            ) : settings.supabaseToken ? (
              <span style={{ color: 'var(--text-2)' }}>Configured — verify by saving again</span>
            ) : undefined}
            onConfigure={() => {
              setSupabaseToken(settings.supabaseToken ?? '');
              setConfiguring('supabase');
            }}
            onDisconnect={handleSupabaseDisconnect}
          />
          {configuring === 'supabase' && (
            <div style={{ padding: 16, background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: 12, marginTop: -8 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>Personal Access Token</label>
                <input type="password" value={supabaseToken} onChange={(e) => setSupabaseToken(e.target.value)} placeholder="sbp_xxx…" />
              </div>
              {supabaseError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(248,113,113,0.08)', borderRadius: 'var(--radius-sm)' }}>
                  <XCircle size={16} style={{ color: 'var(--danger)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--danger)' }}>{supabaseError}</span>
                </div>
              )}
              {supabaseInfo && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(52,211,153,0.08)', borderRadius: 'var(--radius-sm)' }}>
                  <CheckCircle size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--success)' }}>Connected — {supabaseInfo.orgName}</span>
                </div>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleSaveSupabase} className="btn-primary" disabled={supabaseLoading} style={{ opacity: supabaseLoading ? 0.6 : 1 }}>
                  {supabaseLoading ? 'Verifying…' : 'Save'}
                </button>
                <button onClick={() => setConfiguring(null)} className="btn-ghost">Cancel</button>
              </div>
            </div>
          )}

          {/* DEV.to */}
          <IntegrationCard
            name="DEV.to"
            description="Developer community articles and posts"
            icon={<Terminal size={20} />}
            connected={!!settings.devtoApiKey}
            preview={devtoInfo ? (
              <span><strong>{devtoInfo.username}</strong> · {devtoInfo.articles} articles · {devtoInfo.totalReactions} reactions</span>
            ) : settings.devtoApiKey ? (
              <span style={{ color: 'var(--text-2)' }}>Configured — verify by saving again</span>
            ) : undefined}
            onConfigure={() => {
              setDevToApiKey(settings.devtoApiKey ?? '');
              setConfiguring('devto');
            }}
            onDisconnect={handleDevToDisconnect}
          />
          {configuring === 'devto' && (
            <div style={{ padding: 16, background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: 12, marginTop: -8 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>API Key</label>
                <input type="password" value={devtoApiKey} onChange={(e) => setDevToApiKey(e.target.value)} placeholder="devto_xxx…" />
              </div>
              {devtoError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(248,113,113,0.08)', borderRadius: 'var(--radius-sm)' }}>
                  <XCircle size={16} style={{ color: 'var(--danger)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--danger)' }}>{devtoError}</span>
                </div>
              )}
              {devtoInfo && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(52,211,153,0.08)', borderRadius: 'var(--radius-sm)' }}>
                  <CheckCircle size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--success)' }}>Connected as {devtoInfo.username}</span>
                </div>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleSaveDevTo} className="btn-primary" disabled={devtoLoading} style={{ opacity: devtoLoading ? 0.6 : 1 }}>
                  {devtoLoading ? 'Verifying…' : 'Save'}
                </button>
                <button onClick={() => setConfiguring(null)} className="btn-ghost">Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'data' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <section style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, color: 'var(--text-2)', letterSpacing: '0.05em' }}>Export / Import</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button onClick={handleExport} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <Download size={14} /> Export JSON
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <Upload size={14} /> Import JSON
              </button>
              <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
            </div>
          </section>

          <section style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, color: 'var(--danger)', letterSpacing: '0.05em' }}>Danger Zone</h3>
            {confirmClear ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <AlertTriangle size={18} color="var(--danger)" />
                <span style={{ fontSize: 13 }}>Are you sure?</span>
                <button onClick={handleClearAll} className="btn-danger" style={{ fontSize: 12, padding: '6px 14px' }}>Confirm Clear</button>
                <button onClick={() => setConfirmClear(false)} className="btn-ghost" style={{ fontSize: 12, padding: '6px 14px' }}>Cancel</button>
              </div>
            ) : (
              <button onClick={() => setConfirmClear(true)} className="btn-danger">Clear All Data</button>
            )}
          </section>
        </div>
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </motion.div>
  );
}
