import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Crosshair, GitBranch } from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';
import { useProjectsStore } from '../store/projectsStore';
import { useLearningStore } from '../store/learningStore';
import MotivationalPop from '../components/ui/MotivationalPop';
import QuickStats from '../features/dashboard/QuickStats';
import StatusBadge from '../components/ui/StatusBadge';
import { formatDate } from '../utils';
import GitHubWidget from '../components/widgets/GitHubWidget';
import { useIntegrationData } from '../hooks/useIntegrationData';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function DashboardPage() {
  const settings = useSettingsStore((s) => s.settings);
  const { data, loading } = useIntegrationData(settings);

  const projects = useProjectsStore((s) => s.projects);
  const learningItems = useLearningStore((s) => s.items);

  const activeLearning = learningItems.filter((l) => l.status === 'active');
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4);

  const [focusMode, setFocusMode] = useState(() => localStorage.getItem('devos-focus-mode') === 'true');
  const [quickNote, setQuickNote] = useState('');
  const [savedVisible, setSavedVisible] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const toggleFocus = () => {
    setFocusMode((f) => {
      localStorage.setItem('devos-focus-mode', String(!f));
      return !f;
    });
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const todayItems: { icon: React.ReactNode; text: string }[] = [];
  if (data.github) {
    todayItems.push({ icon: <GitBranch size={12} />, text: `${data.github.user.public_repos} repos` });
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
      {loading && <div className="loading-bar" />}

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 0, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
        <p style={{ fontSize: 13, color: 'var(--text-2)' }}>{today}</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={toggleFocus}
            className={focusMode ? 'btn-primary' : 'btn-ghost'}
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, padding: '7px 12px', whiteSpace: 'nowrap' }}
          >
            <Crosshair size={14} /> Focus
          </button>
        </div>
      </div>

      <QuickStats />

      {todayItems.length > 0 && (
        <div className="today-strip">
          {todayItems.map((item, i) => (
            <div key={i} className="today-item">
              {item.icon}
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      )}

      {!loading && data.github && (
        <GitHubWidget data={data.github} />
      )}

      {focusMode ? (
        <>
          <section>
            <h3 className="section-label">Currently Learning</h3>
            {activeLearning.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--text-2)' }}>No active learning topics.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {activeLearning.map((item) => (
                  <div key={item.id} className="card-hover" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)' }}>
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
            <h3 className="section-label">Recent Projects</h3>
            {recentProjects.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--text-2)' }}>No projects yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {recentProjects.map((p) => (
                  <Link key={p.id} to={`/projects/${p.id}`} className="card-hover" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', textDecoration: 'none', color: 'var(--text)' }}>
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
      <MotivationalPop />
    </motion.div>
  );
}
