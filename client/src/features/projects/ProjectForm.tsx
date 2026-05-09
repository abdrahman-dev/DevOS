import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Project, ProjectStatus, ProjectPriority } from '../../types';
import { PROJECT_STATUSES, PROJECT_PRIORITIES } from '../../constants';
import { generateId } from '../../utils';

const projectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  githubUrl: z.string().optional(),
  liveUrl: z.string().optional(),
  tags: z.string(),
  status: z.string(),
  priority: z.string(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof projectSchema>;

interface Props {
  initial?: Project;
  onSubmit: (p: Project) => void;
  onCancel: () => void;
}

export default function ProjectForm({ initial, onSubmit, onCancel }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: initial
      ? { ...initial, tags: initial.tags.join(', ') }
      : { name: '', description: '', githubUrl: '', liveUrl: '', tags: '', status: 'active', priority: 'medium', notes: '' },
  });

  const submit = (data: FormData) => {
    const now = new Date().toISOString();
    const project: Project = {
      id: initial?.id ?? generateId(),
      name: data.name,
      description: data.description,
      githubUrl: data.githubUrl || undefined,
      liveUrl: data.liveUrl || undefined,
      tags: data.tags.split(',').map((t) => t.trim()).filter(Boolean),
      status: data.status as ProjectStatus,
      priority: data.priority as ProjectPriority,
      startedAt: initial?.startedAt ?? now,
      updatedAt: now,
      notes: data.notes || undefined,
    };
    onSubmit(project);
  };

  return (
    <form onSubmit={handleSubmit(submit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>Name</label>
        <input {...register('name')} />
        {errors.name && <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 4 }}>{errors.name.message}</p>}
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>Description</label>
        <textarea {...register('description')} rows={3} style={{ resize: 'vertical' }} />
        {errors.description && <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 4 }}>{errors.description.message}</p>}
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>Status</label>
          <select {...register('status')}>
            {PROJECT_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>Priority</label>
          <select {...register('priority')}>
            {PROJECT_PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>GitHub URL</label>
          <input {...register('githubUrl')} placeholder="https://" />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>Live URL</label>
          <input {...register('liveUrl')} placeholder="https://" />
        </div>
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>Tags (comma-separated)</label>
        <input {...register('tags')} placeholder="react, typescript, api" />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>Notes</label>
        <textarea {...register('notes')} rows={3} style={{ resize: 'vertical' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
        <button type="button" onClick={onCancel} className="btn-ghost">Cancel</button>
        <button type="submit" className="btn-primary">
          {initial ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
