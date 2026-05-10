import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';
import type { OpenRouterWidgetData } from '../../types';

interface Props {
  data?: OpenRouterWidgetData;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function OpenRouterWidget({ data, collapsed, onToggleCollapse }: Props) {
  if (!data) return null;
  const pct = Math.min((data.usage / (data.limit || 1)) * 100, 100);
  return (
    <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-3)', flexShrink: 0 }}>
          <Globe size={16} />
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, flex: 1 }}>OpenRouter</span>
        {onToggleCollapse && (
          <button onClick={onToggleCollapse} aria-label={collapsed ? 'Expand OpenRouter widget' : 'Collapse OpenRouter widget'} style={{ background: 'none', border: 'none', padding: 4, color: 'var(--text-2)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <ChevronDown size={14} style={{ transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
          </button>
        )}
      </div>
      <AnimatePresence>
        {!collapsed && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2, ease: 'easeOut' }} style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Key: {data.label}</div>
            <div style={{ marginTop: 8 }}>
              <div style={{ height: 6, background: 'var(--surface-3)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: data.usage >= data.limit ? 'var(--danger)' : 'var(--accent)', borderRadius: 99, transition: 'width 0.3s' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-2)', marginTop: 3 }}>
                <span>Used: {data.usage.toLocaleString()}</span>
                <span>Limit: {data.limit.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
