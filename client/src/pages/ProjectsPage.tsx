import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import ProjectCard from '../components/cards/ProjectCard';
import SearchBar from '../components/ui/SearchBar';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import ProjectForm from '../features/projects/ProjectForm';
import ProjectsFilter from '../features/projects/ProjectsFilter';
import { useProjectsStore } from '../store/projectsStore';
import { useModal } from '../hooks/useModal';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ui/Toast';
import type { Project, ProjectStatus } from '../types';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function ProjectsPage() {
  const { projects, addProject, updateProject, deleteProject } = useProjectsStore();
  const modal = useModal();
  const { toasts, showToast, removeToast } = useToast();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<ProjectStatus | 'all'>('all');
  const [editing, setEditing] = useState<Project | null>(null);

  const filtered = projects
    .filter((p) => (filter === 'all' ? true : p.status === filter))
    .filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    );

  const openCreate = () => { setEditing(null); modal.open(); };
  const openEdit = (p: Project) => { setEditing(p); modal.open(); };

  const handleSubmit = (p: Project) => {
    if (editing) { updateProject(p); showToast('Project updated', 'success'); }
    else { addProject(p); showToast('Project created', 'success'); }
    modal.close();
  };

  const handleDelete = (id: string) => {
    deleteProject(id);
    showToast('Project deleted', 'info');
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
        <h2 style={{ fontSize: 20 }}>Projects</h2>
        <button onClick={openCreate} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <Plus size={16} />
          Add Project
        </button>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <SearchBar value={search} onChange={setSearch} />
        <ProjectsFilter active={filter} onChange={setFilter} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="No projects found." onAction={openCreate} actionLabel="Add Project" />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 12,
          }}
        >
          {filtered.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} onEdit={openEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <Modal isOpen={modal.isOpen} onClose={modal.close} title={editing ? 'Edit Project' : 'New Project'}>
        <ProjectForm initial={editing ?? undefined} onSubmit={handleSubmit} onCancel={modal.close} />
      </Modal>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </motion.div>
  );
}
