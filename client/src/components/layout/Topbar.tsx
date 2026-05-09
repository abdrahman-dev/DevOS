import AppLogo from '../ui/AppLogo';

interface Props {
  title: string;
}

export default function Topbar({ title }: Props) {
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
    </header>
  );
}
