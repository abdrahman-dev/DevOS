import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Upload, AlertTriangle } from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';
import { useProjectsStore } from '../store/projectsStore';
import { useLearningStore } from '../store/learningStore';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ui/Toast';
import { downloadJson } from '../utils';
import { fetchGitHubUser } from '../services/github';

type Tab = 'general' | 'data';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const tabs: { key: Tab; label: string }[] = [
  { key: 'general', label: 'General' },
  { key: 'data', label: 'Data' },
];

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
  const [githubUsername, setGithubUsername] = useState(settings.githubUsername ?? '');
  const [ghLoading, setGhLoading] = useState(false);
  const [ghInfo, setGhInfo] = useState<{ avatar: string; name: string; publicRepos: number; followers: number } | null>(null);

  useEffect(() => {
    document.title = 'Settings — DevOS';
  }, []);

  const handleThemeChange = (theme: 'dark' | 'light') => {
    saveSettings({ ...settings, theme });
    showToast(`Theme set to ${theme}`, 'info');
  };

  const handleSaveGitHub = async () => {
    if (!githubUsername.trim()) return;
    setGhLoading(true);
    try {
      const user = await fetchGitHubUser(githubUsername.trim());
      setGhInfo({
        avatar: user.avatar_url,
        name: user.name ?? user.login,
        publicRepos: user.public_repos,
        followers: user.followers,
      });
      await saveSettings({ ...settings, githubUsername: githubUsername.trim() });
      showToast('GitHub profile connected', 'success');
    } catch {
      showToast('GitHub user not found', 'error');
    } finally {
      setGhLoading(false);
    }
  };

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
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 0, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
        <p style={{ fontSize: 13, color: 'var(--text-2)' }}>Local only — nothing leaves your device</p>
      </div>

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
        <>
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

          <section style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
            <h3 className="section-label" style={{ marginBottom: 14 }}>GitHub</h3>
            <p style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 12, lineHeight: 1.6 }}>
              Your username is used to fetch your repositories and profile stats.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                placeholder="your-github-username"
                style={{ flex: 1 }}
              />
              <button
                className="btn-primary"
                onClick={handleSaveGitHub}
                disabled={ghLoading}
                style={{ opacity: ghLoading ? 0.6 : 1, whiteSpace: 'nowrap' }}
              >
                {ghLoading ? 'Saving…' : 'Save'}
              </button>
            </div>
            {ghInfo && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                marginTop: 12, padding: '10px 14px',
                background: 'var(--color-confirm-bg)',
                borderRadius: 'var(--radius-sm)',
              }}>
                <img src={ghInfo.avatar} alt="" style={{ width: 28, height: 28, borderRadius: '50%' }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{ghInfo.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-2)' }}>
                    {ghInfo.publicRepos} repos · {ghInfo.followers} followers
                  </div>
                </div>
              </div>
            )}
          </section>
        </>
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
                <button onClick={handleClearAll} className="btn-confirm" style={{ fontSize: 12, padding: '6px 14px' }}>Confirm Clear</button>
                <button onClick={() => setConfirmClear(false)} className="btn-ghost" style={{ fontSize: 12, padding: '6px 14px' }}>Cancel</button>
              </div>
            ) : (
              <button onClick={() => setConfirmClear(true)} className="btn-delete">Clear All Data</button>
            )}
          </section>
        </div>
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </motion.div>
  );
}
