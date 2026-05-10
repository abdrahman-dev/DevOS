import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import type { Toast as ToastType } from '../../types';

const config: Record<string, { icon: typeof CheckCircle; border: string; duration: number }> = {
  success: { icon: CheckCircle, border: 'var(--success)', duration: 2500 },
  error: { icon: XCircle, border: 'var(--danger)', duration: 5000 },
  info: { icon: Info, border: 'var(--accent)', duration: 2500 },
};

interface Props {
  toasts: ToastType[];
  onRemove: (id: string) => void;
}

export default function ToastContainer({ toasts, onRemove }: Props) {
  return (
    <div
      className="toast-container"
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        maxWidth: 380,
      }}
    >
      <AnimatePresence>
        {toasts.map((t) => {
          const c = config[t.type];
          const Icon = c.icon;
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.18 }}
              style={{
                background: 'var(--surface)',
                border: '1.5px solid var(--border)',
                borderLeft: `3px solid ${c.border}`,
                borderRadius: 'var(--radius)',
                boxShadow: 'var(--shadow-md)',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                color: 'var(--text)',
                fontSize: 13,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Icon size={16} style={{ color: c.border, flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{t.message}</span>
              <button
                onClick={() => onRemove(t.id)}
                className="btn-ghost"
                style={{ padding: 4, lineHeight: 0, borderRadius: 'var(--radius-sm)', border: 'none' }}
              >
                <X size={14} />
              </button>
              <div
                className="toast-drain"
                style={{ animationDuration: `${c.duration}ms` }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
