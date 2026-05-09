import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, GitBranch, ExternalLink, Edit2 } from 'lucide-react';
import { useProjectsStore } from '../store/projectsStore';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import ProjectForm from '../features/projects/ProjectForm';
import { useModal } from '../hooks/useModal';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ui/Toast';
import { formatDate } from '../utils';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, updateProject } = useProjectsStore();
  const modal = useModal();
  const { toasts, showToast, removeToast } = useToast();

  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ padding: 24 }}
      >
        <p style={{ color: 'var(--text-2)' }}>Project not found.</p>
        <Link to="/projects" style={{ fontSize: 13 }}>Back to projects</Link>
      </motion.div>
    );
  }

  const handleEdit = (p: typeof project) => {
    updateProject(p);
    showToast('Project updated', 'success');
    modal.close();
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.18, ease: 'easeOut' }}
      style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 720 }}
    >
      <button
        onClick={() => navigate('/projects')}
        className="btn-ghost"
        style={{ display: 'flex', alignItems: 'center', gap: 6, alignSelf: 'flex-start', padding: '6px 12px' }}
      >
        <ArrowLeft size={14} />
        Back
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 22 }}>{project.name}</h2>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <StatusBadge status={project.status} />
          </div>
        </div>
        <button onClick={modal.open} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Edit2 size={14} />
          Edit
        </button>
      </div>

      <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-3)' }}>{project.description}</p>

      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Priority</div>
          <div style={{ fontSize: 14, marginTop: 4, textTransform: 'capitalize' }}>{project.priority}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Started</div>
          <div style={{ fontSize: 14, marginTop: 4 }}>{formatDate(project.startedAt)}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Updated</div>
          <div style={{ fontSize: 14, marginTop: 4 }}>{formatDate(project.updatedAt)}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {project.tags.map((t) => (
          <span key={t} style={{ fontSize: 12, padding: '3px 12px', borderRadius: 99, background: 'var(--surface-3)', color: 'var(--text-3)' }}>{t}</span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13 }}>
            <GitBranch size={16} /> GitHub
          </a>
        )}
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13 }}>
            <ExternalLink size={16} /> Live
          </a>
        )}
      </div>

      {project.notes && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Notes</div>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-3)' }}>{project.notes}</p>
        </div>
      )}

      <Modal isOpen={modal.isOpen} onClose={modal.close} title="Edit Project">
        <ProjectForm initial={project} onSubmit={handleEdit} onCancel={modal.close} />
      </Modal>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </motion.div>
  );
}
