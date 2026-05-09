import type { ReactNode } from 'react';

interface Props {
  message: string;
  onAction?: () => void;
  actionLabel?: string;
  children?: ReactNode;
}

export default function EmptyState({ message, onAction, actionLabel, children }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 24px',
        textAlign: 'center',
        gap: 16,
      }}
    >
      <pre
        style={{
          color: 'var(--text-3)',
          fontSize: 11,
          lineHeight: 1.2,
          userSelect: 'none',
          fontFamily: 'var(--font-mono)',
        }}
      >
{`  ___ _   _ ___ 
 | _ \\ | | | _ \\
 |  _/ |_| |  _/
 |_|  \\___/|_|  `}
      </pre>
      <p style={{ color: 'var(--text-2)', fontSize: 14 }}>{message}</p>
      {onAction && actionLabel && (
        <button className="btn-primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
      {children}
    </div>
  );
}
