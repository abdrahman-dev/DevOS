import { motion } from 'framer-motion';
import { useState, useEffect, useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Crosshair, SlidersHorizontal, Github, Clock, Cpu, Server, BookOpen } from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';
import { useProjectsStore } from '../store/projectsStore';
import { useLearningStore } from '../store/learningStore';
import QuickStats from '../features/dashboard/QuickStats';
import StatusBadge from '../components/ui/StatusBadge';
import { formatDate } from '../utils';
import GitHubWidget from '../components/widgets/GitHubWidget';
import OpenRouterWidget from '../components/widgets/OpenRouterWidget';
import VercelWidget from '../components/widgets/VercelWidget';
import OllamaWidget from '../components/widgets/OllamaWidget';
import WakaTimeWidget from '../components/widgets/WakaTimeWidget';
import RailwayWidget from '../components/widgets/RailwayWidget';
import RenderWidget from '../components/widgets/RenderWidget';
import SupabaseWidget from '../components/widgets/SupabaseWidget';
import DevToWidget from '../components/widgets/DevToWidget';
import { useIntegrationData } from '../hooks/useIntegrationData';
import { useWidgetCollapse } from '../hooks/useWidgetCollapse';
import { useWidgetVisibility } from '../hooks/useWidgetVisibility';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

interface WidgetEntry {
  key: string;
  label: string;
  connected: boolean;
  component: (data: any) => ReactNode;
  data: any;
}

const widgetList: { key: string; label: string }[] = [
  { key: 'github', label: 'GitHub' },
  { key: 'openrouter', label: 'OpenRouter' },
  { key: 'vercel', label: 'Vercel' },
  { key: 'ollama', label: 'Ollama' },
  { key: 'wakatime', label: 'WakaTime' },
  { key: 'railway', label: 'Railway' },
  { key: 'render', label: 'Render' },
  { key: 'supabase', label: 'Supabase' },
  { key: 'devto', label: 'DEV.to' },
];

export default function DashboardPage() {
  const settings = useSettingsStore((s) => s.settings);
  const { data, loading } = useIntegrationData(settings);
  const { isCollapsed, toggle } = useWidgetCollapse();
  const { isVisible, toggle: toggleVisibility } = useWidgetVisibility();

  const projects = useProjectsStore((s) => s.projects);
  const learningItems = useLearningStore((s) => s.items);

  const activeLearning = learningItems.filter((l) => l.status === 'active');
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4);

  const [focusMode, setFocusMode] = useState(() => localStorage.getItem('devos-focus-mode') === 'true');
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [quickNote, setQuickNote] = useState('');
  const [savedVisible, setSavedVisible] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const customizeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  useEffect(() => {
    document.title = 'Dashboard — DevOS';
    const saved = localStorage.getItem('devos-quick-note');
    if (saved) setQuickNote(saved);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      localStorage.setItem('devos-quick-note', quickNote);
      setSavedVisible(true);
      setTimeout(() => setSavedVisible(false), 1500);
    }, 500);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [quickNote]);

  useEffect(() => {
    if (!customizeOpen) return;
    const handler = (e: MouseEvent) => {
      if (customizeRef.current && !customizeRef.current.contains(e.target as Node)) {
        setCustomizeOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [customizeOpen]);

  const toggleFocus = () => {
    setFocusMode((f) => {
      localStorage.setItem('devos-focus-mode', String(!f));
      return !f;
    });
  };

  const buildWidgetEntry = (key: string): WidgetEntry => {
    const connected = !!(settings as any)[{
      github: 'githubUsername',
      openrouter: 'openRouterApiKey',
      vercel: 'vercelApiToken',
      ollama: 'ollamaBaseUrl',
      wakatime: 'wakatimeApiKey',
      railway: 'railwayToken',
      render: 'renderApiKey',
      supabase: 'supabaseToken',
      devto: 'devtoApiKey',
    }[key]!];

    const comps: Record<string, (d: any) => ReactNode> = {
      github: (d: any) => <GitHubWidget data={d} collapsed={isCollapsed('github')} onToggleCollapse={() => toggle('github')} />,
      openrouter: (d: any) => <OpenRouterWidget data={d} collapsed={isCollapsed('openrouter')} onToggleCollapse={() => toggle('openrouter')} />,
      vercel: (d: any) => <VercelWidget data={d} collapsed={isCollapsed('vercel')} onToggleCollapse={() => toggle('vercel')} />,
      ollama: (d: any) => <OllamaWidget data={d} collapsed={isCollapsed('ollama')} onToggleCollapse={() => toggle('ollama')} />,
      wakatime: (d: any) => <WakaTimeWidget data={d} collapsed={isCollapsed('wakatime')} onToggleCollapse={() => toggle('wakatime')} />,
      railway: (d: any) => <RailwayWidget data={d} collapsed={isCollapsed('railway')} onToggleCollapse={() => toggle('railway')} />,
      render: (d: any) => <RenderWidget data={d} collapsed={isCollapsed('render')} onToggleCollapse={() => toggle('render')} />,
      supabase: (d: any) => <SupabaseWidget data={d} collapsed={isCollapsed('supabase')} onToggleCollapse={() => toggle('supabase')} />,
      devto: (d: any) => <DevToWidget data={d} collapsed={isCollapsed('devto')} onToggleCollapse={() => toggle('devto')} />,
    };

    return {
      key,
      label: widgetList.find((w) => w.key === key)?.label ?? key,
      connected,
      component: comps[key],
      data: (data as any)[key],
    };
  };

  const allWidgets = widgetList.map((w) => buildWidgetEntry(w.key));
  const connectedWidgets = allWidgets.filter((w) => w.connected && isVisible(w.key));
  const anyConnected = allWidgets.some((w) => w.connected);

  const todayItems: { icon: ReactNode; text: string }[] = [];
  if (data.github) {
    todayItems.push({ icon: <Github size={12} />, text: `${data.github.publicRepos} repos` });
  }
  if (data.wakatime) {
    todayItems.push({ icon: <Clock size={12} />, text: `${data.wakatime.totalCodingTime} coded (7d)` });
  }
  if (data.vercel) {
    todayItems.push({ icon: <Server size={12} />, text: `${data.vercel.projects} Vercel projects` });
  }
  if (data.ollama) {
    todayItems.push({ icon: <Cpu size={12} />, text: `${data.ollama.models} local models` });
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.18, ease: 'easeOut' }}
      style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 1000 }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 20, marginBottom: 2 }}>Dashboard</h2>
          <p style={{ fontSize: 12, color: 'var(--text-2)' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, position: 'relative' }}>
          <button
            onClick={toggleFocus}
            className={focusMode ? 'btn-primary' : 'btn-ghost'}
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, padding: '7px 12px', whiteSpace: 'nowrap' }}
          >
            <Crosshair size={14} /> Focus
          </button>
          <div ref={customizeRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setCustomizeOpen((o) => !o)}
              className="btn-ghost"
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, padding: '7px 12px', whiteSpace: 'nowrap' }}
            >
              <SlidersHorizontal size={14} /> Customize
            </button>
            {customizeOpen && (
              <div className="customize-panel">
                {allWidgets.filter((w) => w.connected).map((w) => (
                  <div key={w.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <span style={{ fontSize: 12, color: 'var(--text)' }}>{w.label}</span>
                    <button
                      onClick={() => toggleVisibility(w.key)}
                      style={{
                        width: 36, height: 20, borderRadius: 99,
                        background: isVisible(w.key) ? 'var(--accent)' : 'var(--surface-3)',
                        border: 'none', padding: 0, cursor: 'pointer',
                        position: 'relative', transition: 'background 0.2s',
                      }}
                    >
                      <span style={{
                        position: 'absolute', top: 3, left: isVisible(w.key) ? 18 : 3,
                        width: 14, height: 14, borderRadius: '50%',
                        background: '#fff', transition: 'left 0.2s',
                      }} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <QuickStats />

      {anyConnected && todayItems.length > 0 && (
        <div className="today-strip">
          {todayItems.map((item, i) => (
            <div key={i} className="today-item">
              {item.icon}
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      )}

      {focusMode ? (
        <>
          <section>
            <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, color: 'var(--text-2)', letterSpacing: '0.05em' }}>
              Currently Learning
            </h3>
            {activeLearning.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--text-2)' }}>No active learning topics.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {activeLearning.map((item) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{item.topic}</div>
                      {item.source && <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{item.source}</div>}
                    </div>
                    <div style={{ width: 140 }}>
                      <div style={{ height: 6, background: 'var(--surface-3)', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${item.progress}%`, background: 'var(--accent)', borderRadius: 99, transition: 'width 0.3s' }} />
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 3, textAlign: 'right' }}>{item.progress}%</div>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, color: 'var(--text-2)', letterSpacing: '0.05em' }}>
              Recent Projects
            </h3>
            {recentProjects.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--text-2)' }}>No projects yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {recentProjects.map((p) => (
                  <Link key={p.id} to={`/projects/${p.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', textDecoration: 'none', color: 'var(--text)', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{p.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <StatusBadge status={p.status} />
                      <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{formatDate(p.updatedAt)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </>
      ) : (
        <>
          {loading && connectedWidgets.length > 0 && (
            <div className="widget-scroll-row">
              {connectedWidgets.map((w) => (
                <div key={w.key} className="widget-scroll-item">
                  <div className="widget-skeleton" />
                </div>
              ))}
            </div>
          )}

          {!loading && connectedWidgets.length > 0 && (
            <div className="widget-scroll-row">
              {connectedWidgets.map((w, i) => (
                <motion.div
                  key={w.key}
                  className="widget-scroll-item"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.06 }}
                >
                  {w.component(w.data)}
                </motion.div>
              ))}
            </div>
          )}

          <section style={{ position: 'relative', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
            <textarea
              value={quickNote}
              onChange={(e) => setQuickNote(e.target.value)}
              placeholder="// jot something down..."
              style={{
                width: '100%',
                minHeight: 100,
                padding: 16,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                resize: 'none',
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                color: 'var(--text)',
                lineHeight: 1.6,
                boxSizing: 'border-box',
              }}
            />
            <span
              style={{
                position: 'absolute',
                bottom: 8,
                right: 10,
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--success)',
                opacity: savedVisible ? 1 : 0,
                transition: 'opacity 0.3s ease',
                pointerEvents: 'none',
              }}
            >
              ✓ saved
            </span>
          </section>
        </>
      )}
    </motion.div>
  );
}
