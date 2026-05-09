import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface Props {
  label: string;
  value: number | string;
  icon?: LucideIcon;
  accent?: boolean;
}

export default function StatCard({ label, value, icon: Icon, accent }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0.5, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        background: 'var(--surface)',
        border: '1.5px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        cursor: 'default',
        animation: 'shimmer 0.4s ease-out',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-hover)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {accent && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'var(--accent)' }} />
      )}
      {Icon && (
        <div style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent-subtle)', color: accent ? 'var(--accent)' : 'var(--text-2)', flexShrink: 0 }}>
          <Icon size={19} />
        </div>
      )}
      <div>
        <div style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.2, color: accent ? 'var(--accent)' : 'var(--text)' }}>{value}</div>
        <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 1 }}>{label}</div>
      </div>
    </motion.div>
  );
}
