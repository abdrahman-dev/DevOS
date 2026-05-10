import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, ChevronDown } from 'lucide-react';
import type { OllamaWidgetData } from '../../types';

interface Props {
  data?: OllamaWidgetData;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function OllamaWidget({ data, collapsed, onToggleCollapse }: Props) {
  if (!data) return null;
  return (
    <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-3)', flexShrink: 0 }}>
          <Cpu size={16} />
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, flex: 1 }}>Ollama</span>
        {onToggleCollapse && (
          <button onClick={onToggleCollapse} aria-label={collapsed ? 'Expand Ollama widget' : 'Collapse Ollama widget'} style={{ background: 'none', border: 'none', padding: 4, color: 'var(--text-2)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <ChevronDown size={14} style={{ transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
          </button>
        )}
      </div>
      <AnimatePresence>
        {!collapsed && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2, ease: 'easeOut' }} style={{ overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{data.version}</div>
                <div style={{ fontSize: 11, color: 'var(--text-2)' }}>version</div>
              </div>
              <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{data.models}</div>
                <div style={{ fontSize: 11, color: 'var(--text-2)' }}>models</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
