import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { LearningItem, LearningStatus } from '../../types';
import { LEARNING_STATUSES } from '../../constants';
import { generateId } from '../../utils';

const learningSchema = z.object({
  topic: z.string().min(1, 'Topic is required'),
  source: z.string().optional(),
  progress: z.coerce.number().min(0).max(100),
  status: z.string(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof learningSchema>;

interface Props {
  initial?: LearningItem;
  onSubmit: (item: LearningItem) => void;
  onCancel: () => void;
}

export default function LearningForm({ initial, onSubmit, onCancel }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(learningSchema),
    defaultValues: initial ?? { topic: '', source: '', progress: 0, status: 'active', notes: '' },
  });

  const submit = (data: FormData) => {
    const now = new Date().toISOString();
    const item: LearningItem = {
      id: initial?.id ?? generateId(),
      topic: data.topic,
      source: data.source || undefined,
      progress: data.progress,
      status: data.status as LearningStatus,
      notes: data.notes || undefined,
      createdAt: initial?.createdAt ?? now,
      updatedAt: now,
    };
    onSubmit(item);
  };

  return (
    <form onSubmit={handleSubmit(submit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>Topic</label>
        <input {...register('topic')} />
        {errors.topic && <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 4 }}>{errors.topic.message}</p>}
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>Source</label>
          <input {...register('source')} placeholder="URL or resource name" />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>Progress (0–100)</label>
          <input {...register('progress')} type="number" min={0} max={100} />
        </div>
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>Status</label>
        <select {...register('status')}>
          {LEARNING_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
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
