import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ChevronDown } from 'lucide-react';
import type { RailwayWidgetData } from '../../types';

interface Props {
  data?: RailwayWidgetData;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function RailwayWidget({ data, collapsed, onToggleCollapse }: Props) {
  if (!data) return null;
  return (
    <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-3)', flexShrink: 0 }}>
          <Zap size={16} />
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, flex: 1 }}>Railway</span>
        {onToggleCollapse && (
          <button onClick={onToggleCollapse} style={{ background: 'none', border: 'none', padding: 4, color: 'var(--text-2)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <ChevronDown size={14} style={{ transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
          </button>
        )}
      </div>
      <AnimatePresence>
        {!collapsed && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2, ease: 'easeOut' }} style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{data.name}</div>
            <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', textAlign: 'center', marginTop: 8 }}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{data.projects}</div>
              <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 1 }}>projects</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
