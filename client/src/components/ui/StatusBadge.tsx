import type { ProjectStatus, LearningStatus } from '../../types';

type Status = ProjectStatus | LearningStatus;

type StyleMap = {
  bg: string;
  color: string;
};

const styles: Record<Status, StyleMap> = {
  active: { bg: 'rgba(52,211,153,0.12)', color: 'var(--success)' },
  learning: { bg: 'var(--accent-subtle)', color: 'var(--accent)' },
  paused: { bg: 'rgba(251,191,36,0.12)', color: 'var(--warning)' },
  completed: { bg: 'rgba(100,116,139,0.12)', color: 'var(--text-2)' },
  idea: { bg: 'rgba(167,139,250,0.12)', color: 'var(--purple)' },
};

interface Props {
  status: Status;
}

export default function StatusBadge({ status }: Props) {
  const s = styles[status];
  return (
    <span
      data-status={status}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 11,
        fontWeight: 600,
        padding: '3px 10px',
        borderRadius: 99,
        background: s.bg,
        color: s.color,
        lineHeight: 1.3,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
      {status}
    </span>
  );
}
