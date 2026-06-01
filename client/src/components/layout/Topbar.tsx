import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import AppLogo from '../ui/AppLogo';
import UserPopover from '../ui/UserPopover';

interface Props {
  title: string;
}

export default function Topbar({ title }: Props) {
  const user = useAuthStore((s) => s.user);
  const [open, setOpen] = useState(false);

  return (
    <header
      className="topbar"
      style={{
        position: 'fixed',
        top: 0,
        left: 'var(--sidebar-width)',
        right: 0,
        height: 'var(--topbar-height)',
        borderBottom: '1.5px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 50,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="mobile-logo">
          <AppLogo size={28} />
        </div>
        <h1 style={{ fontSize: 16, fontWeight: 700 }}>{title}</h1>
      </div>
      {user && (
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setOpen((o) => !o)}
            style={{
              width: 32, height: 32,
              borderRadius: '50%',
              border: '2px solid var(--border)',
              overflow: 'hidden',
              background: 'var(--accent-subtle)',
              color: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700,
              cursor: 'pointer',
              padding: 0,
              flexShrink: 0,
              transition: 'border-color 0.2s',
              minHeight: 'auto',
            }}
            aria-label="User menu"
          >
            {user.avatar
              ? <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : user.name?.[0]?.toUpperCase() ?? '?'
            }
          </button>
          {open && <UserPopover onClose={() => setOpen(false)} direction="down" />}
        </div>
      )}
    </header>
  );
}
