import type { ProjectStatus } from '../../types';
import { PROJECT_STATUSES } from '../../constants';

interface Props {
  active: ProjectStatus | 'all';
  onChange: (status: ProjectStatus | 'all') => void;
}

export default function ProjectsFilter({ active, onChange }: Props) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {[{ value: 'all' as const, label: 'All' }, ...PROJECT_STATUSES].map((s) => {
        const isActive = active === s.value;
        return (
          <button
            key={s.value}
            onClick={() => onChange(s.value)}
            style={{
              fontSize: 12,
              padding: '5px 14px',
              borderRadius: 99,
              background: isActive ? 'var(--accent)' : 'var(--surface-2)',
              color: isActive ? '#fff' : 'var(--text-2)',
              border: '1.5px solid transparent',
              fontWeight: isActive ? 600 : 400,
            }}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}
