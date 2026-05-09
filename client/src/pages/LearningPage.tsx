import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import SearchBar from '../components/ui/SearchBar';
import StatusBadge from '../components/ui/StatusBadge';
import LearningForm from '../features/learning/LearningForm';
import { useLearningStore } from '../store/learningStore';
import { useModal } from '../hooks/useModal';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ui/Toast';
import type { LearningItem, LearningStatus } from '../types';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const statusFilters: (LearningStatus | 'all')[] = ['all', 'active', 'paused', 'completed'];

export default function LearningPage() {
  const { items, addItem, updateItem, deleteItem } = useLearningStore();
  const modal = useModal();
  const { toasts, showToast, removeToast } = useToast();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<LearningStatus | 'all'>('all');
  const [editing, setEditing] = useState<LearningItem | null>(null);

  const filtered = items
    .filter((l) => (filter === 'all' ? true : l.status === filter))
    .filter((l) => l.topic.toLowerCase().includes(search.toLowerCase()));

  const openCreate = () => { setEditing(null); modal.open(); };
  const openEdit = (item: LearningItem) => { setEditing(item); modal.open(); };

  const handleSubmit = (item: LearningItem) => {
    if (editing) { updateItem(item); showToast('Learning topic updated', 'success'); }
    else { addItem(item); showToast('Learning topic added', 'success'); }
    modal.close();
  };

  const handleDelete = (id: string) => {
    deleteItem(id);
    showToast('Learning topic deleted', 'info');
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.18, ease: 'easeOut' }}
      style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ fontSize: 20 }}>Learning</h2>
        <button onClick={openCreate} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <Plus size={16} />
          Add Topic
        </button>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search topics…" />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {statusFilters.map((s) => {
            const isActive = filter === s;
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                style={{
                  fontSize: 12,
                  padding: '5px 14px',
                  borderRadius: 99,
                  background: isActive ? 'var(--accent)' : 'var(--surface-2)',
                  color: isActive ? '#fff' : 'var(--text-2)',
                  border: '1.5px solid transparent',
                  fontWeight: isActive ? 600 : 400,
                  textTransform: 'capitalize',
                }}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="No learning topics yet." onAction={openCreate} actionLabel="Add Topic" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut', delay: i * 0.03 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '14px 18px',
                background: 'var(--surface)',
                border: '1.5px solid var(--border)',
                borderRadius: 'var(--radius)',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{item.topic}</div>
                {item.source && (
                  <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{item.source}</div>
                )}
              </div>

              <div style={{ width: 140 }}>
                <div style={{ height: 6, background: 'var(--surface-3)', borderRadius: 99, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${item.progress}%`,
                      background: item.status === 'completed' ? 'var(--success)' : 'var(--accent)',
                      borderRadius: 99,
                      transition: 'width 0.3s',
                    }}
                  />
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 3, textAlign: 'right' }}>
                  {item.progress}%
                </div>
              </div>

              <StatusBadge status={item.status} />

              <div style={{ display: 'flex', gap: 4 }}>
                <button onClick={() => openEdit(item)} className="btn-ghost" style={{ padding: 6, lineHeight: 0, borderRadius: 'var(--radius-sm)' }}>
                  <Edit2 size={14} />
                </button>
                <button onClick={() => handleDelete(item.id)} className="btn-ghost" style={{ padding: 6, lineHeight: 0, borderRadius: 'var(--radius-sm)', color: 'var(--danger)' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={modal.isOpen} onClose={modal.close} title={editing ? 'Edit Topic' : 'New Topic'}>
        <LearningForm initial={editing ?? undefined} onSubmit={handleSubmit} onCancel={modal.close} />
      </Modal>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </motion.div>
  );
}
