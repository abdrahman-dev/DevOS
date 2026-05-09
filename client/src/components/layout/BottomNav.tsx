import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, BookOpen, Settings } from 'lucide-react';
import { ROUTES } from '../../constants';

const links = [
  { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { to: ROUTES.PROJECTS, label: 'Projects', icon: FolderKanban },
  { to: ROUTES.LEARNING, label: 'Learning', icon: BookOpen },
  { to: ROUTES.SETTINGS, label: 'Settings', icon: Settings },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === ROUTES.DASHBOARD}
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            padding: '6px 16px',
            position: 'relative',
            color: isActive ? 'var(--accent)' : 'var(--text-2)',
            textDecoration: 'none',
            fontSize: 10,
            fontWeight: isActive ? 600 : 400,
            transition: 'color 0.2s',
            borderRadius: 'var(--radius-sm)',
            background: isActive ? 'var(--accent-subtle)' : 'transparent',
            minHeight: 44,
          })}
        >
          <link.icon size={20} />
          <span>{link.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
