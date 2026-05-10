import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, BookOpen, Users, Star, ChevronDown } from 'lucide-react';
import type { GitHubWidgetData } from '../../types';

interface Props {
  data?: GitHubWidgetData;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function GitHubWidget({ data, collapsed, onToggleCollapse }: Props) {
  if (!data) return null;
  return (
    <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <img src={data.avatar} alt="" loading="lazy" style={{ width: 32, height: 32, borderRadius: '50%', border: '1.5px solid var(--border)' }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{data.name}</div>
          <div style={{ display: 'flex', gap: 10, fontSize: 11, color: 'var(--text-2)', marginTop: 2 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><BookOpen size={11} /> {data.publicRepos} repos</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Users size={11} /> {data.followers} followers</span>
          </div>
        </div>
        {onToggleCollapse && (
          <button onClick={onToggleCollapse} aria-label={collapsed ? 'Expand GitHub widget' : 'Collapse GitHub widget'} style={{ background: 'none', border: 'none', padding: 4, color: 'var(--text-2)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <ChevronDown size={14} style={{ transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
          </button>
        )}
      </div>
      <AnimatePresence>
        {!collapsed && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2, ease: 'easeOut' }} style={{ overflow: 'hidden' }}>
            {data.topRepos.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', letterSpacing: '0.04em' }}>Top Repos</div>
                {data.topRepos.map((repo) => (
                  <div key={repo.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                    <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{repo.name}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: 'var(--text-2)', flexShrink: 0 }}><Star size={10} /> {repo.stars}</span>
                    <span style={{ color: 'var(--text-3)', fontSize: 11, flexShrink: 0 }}>{repo.language}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
