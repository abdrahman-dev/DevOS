import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, BookOpen, Settings, Sun, Moon } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { ROUTES } from '../../constants';
import AppLogo from '../ui/AppLogo';

const links = [
  { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { to: ROUTES.PROJECTS, label: 'Projects', icon: FolderKanban },
  { to: ROUTES.LEARNING, label: 'Learning', icon: BookOpen },
  { to: ROUTES.SETTINGS, label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const { settings, saveSettings } = useSettingsStore();
  const navigate = useNavigate();

  const toggleTheme = () => {
    saveSettings({
      ...settings,
      theme: settings.theme === 'dark' ? 'light' : 'dark',
    });
  };

  return (
    <aside
      className="sidebar"
      style={{
        position: 'fixed',
        left: 0, top: 0, bottom: 0,
        width: 'var(--sidebar-width)',
        background: 'linear-gradient(180deg, rgba(19,23,32,0.85) 0%, rgba(13,15,20,0.9) 100%)',
        borderRight: '1.5px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 99,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '24px 20px 20px',
          borderBottom: '1.5px solid var(--border)',
        }}
      >
        <div
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <AppLogo size={28} />
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 20,
              fontWeight: 800,
              background: 'linear-gradient(135deg, var(--accent), var(--purple))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: -0.5,
            }}
          >
            DevOS
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === ROUTES.DASHBOARD}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 11,
              padding: '10px 14px',
              color: isActive ? 'var(--accent)' : 'var(--text-2)',
              background: isActive ? 'var(--accent-subtle)' : 'transparent',
              borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: isActive ? 600 : 400,
              transition: 'all 0.2s',
            })}
          >
            <link.icon size={17} />
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Shortcuts */}
      <div style={{ padding: '8px 14px', fontSize: 10, color: 'var(--text-2)', fontFamily: 'var(--font-mono)', lineHeight: 1.8 }}>
        <div><kbd>N</kbd> New project</div>
        <div><kbd>/</kbd> Search</div>
        <div><kbd>G</kbd> then <kbd>D</kbd>/<kbd>P</kbd>/<kbd>L</kbd>/<kbd>S</kbd> Navigate</div>
      </div>

      {/* Theme toggle */}
      <div style={{ padding: '12px 14px 16px', borderTop: '1.5px solid var(--border)', marginTop: 4 }}>
          <button
            onClick={toggleTheme}
            aria-label={settings.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            width: '100%',
            background: 'var(--surface-2)',
            border: '1.5px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-2)',
            fontSize: 12,
            padding: '9px 14px',
          }}
        >
          {settings.theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          <span style={{ flex: 1, textAlign: 'left' }}>
            {settings.theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </span>
        </button>
      </div>
    </aside>
  );
}