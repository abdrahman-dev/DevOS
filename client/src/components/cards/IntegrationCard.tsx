import type { ReactNode } from 'react';

interface Props {
  name: string;
  description: string;
  icon: ReactNode;
  connected: boolean;
  preview?: ReactNode;
  onConfigure: () => void;
  onDisconnect: () => void;
}

export default function IntegrationCard({ name, description, icon, connected, preview, onConfigure, onDisconnect }: Props) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1.5px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--surface-3)',
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 1 }}>{description}</div>
        </div>
      </div>

      {connected && preview && (
        <div
          style={{
            padding: '10px 12px',
            background: 'var(--surface-2)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 12,
            color: 'var(--text-3)',
          }}
        >
          {preview}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            fontSize: 11,
            fontWeight: 600,
            padding: '3px 10px',
            borderRadius: 99,
            background: connected ? 'rgba(52,211,153,0.12)' : 'rgba(100,116,139,0.12)',
            color: connected ? 'var(--success)' : 'var(--text-2)',
          }}
        >
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />
          {connected ? 'Connected' : 'Not Connected'}
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={onConfigure} className="btn-ghost" style={{ fontSize: 11, padding: '5px 12px' }}>
            Configure
          </button>
          {connected && (
            <button onClick={onDisconnect} className="btn-ghost" style={{ fontSize: 11, padding: '5px 12px', color: 'var(--danger)' }}>
              Disconnect
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
