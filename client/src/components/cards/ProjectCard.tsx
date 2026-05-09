import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Edit2, Trash2, MoreHorizontal } from 'lucide-react';
import type { Project } from '../../types';
import StatusBadge from '../ui/StatusBadge';
import { truncate } from '../../utils';

const priorityColor: Record<string, string> = {
  low: 'var(--text-2)',
  medium: 'var(--warning)',
  high: 'var(--danger)',
};

interface Props {
  project: Project;
  index?: number;
  onEdit: (p: Project) => void;
  onDelete: (id: string) => void;
}

export default function ProjectCard({ project, index = 0, onEdit, onDelete }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const tags = project.tags.slice(0, 3);
  const pColor = priorityColor[project.priority];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut', delay: index * 0.05 }}
      style={{
        background: 'var(--surface)',
        border: '1.5px solid var(--border)',
        borderLeft: `3px solid ${pColor}`,
        borderRadius: 'var(--radius)',
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        transition: 'border-color 0.2s, box-shadow 0.2s',
        position: 'relative',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <Link to={`/projects/${project.id}`} style={{ textDecoration: 'none', color: 'var(--text)', flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>{project.name}</h3>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div className="card-actions desktop-actions" style={{ display: 'flex', gap: 4 }}>
            <button onClick={() => onEdit(project)} className="btn-ghost" style={{ padding: 6, lineHeight: 0, borderRadius: 'var(--radius-sm)' }}>
              <Edit2 size={14} />
            </button>
            {confirming ? (
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <button onClick={() => { onDelete(project.id); setConfirming(false); }} className="btn-danger" style={{ fontSize: 11, padding: '4px 8px', borderRadius: 'var(--radius-sm)' }}>Confirm</button>
                <button onClick={() => setConfirming(false)} className="btn-ghost" style={{ fontSize: 11, padding: '4px 8px', borderRadius: 'var(--radius-sm)' }}>Cancel</button>
              </div>
            ) : (
              <button onClick={() => setConfirming(true)} className="btn-ghost" style={{ padding: 6, lineHeight: 0, borderRadius: 'var(--radius-sm)', color: 'var(--danger)' }}>
                <Trash2 size={14} />
              </button>
            )}
          </div>
          <StatusBadge status={project.status} />
          <div className="mobile-menu-btn" style={{ display: 'none', position: 'relative' }}>
            <button onClick={() => setMenuOpen(!menuOpen)} className="btn-ghost" style={{ padding: 6, lineHeight: 0, borderRadius: 'var(--radius-sm)' }}>
              <MoreHorizontal size={16} />
            </button>
            {menuOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setMenuOpen(false)} />
                <div style={{ position: 'absolute', top: 32, right: 0, zIndex: 11, background: 'var(--surface-2)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-md)', padding: 4, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 120 }}>
                  <button onClick={() => { onEdit(project); setMenuOpen(false); }} className="btn-ghost" style={{ justifyContent: 'flex-start', gap: 8, padding: '8px 12px', fontSize: 12, borderRadius: 'var(--radius-sm)' }}><Edit2 size={13} /> Edit</button>
                  <button onClick={() => { setConfirming(true); setMenuOpen(false); }} className="btn-ghost" style={{ justifyContent: 'flex-start', gap: 8, padding: '8px 12px', fontSize: 12, borderRadius: 'var(--radius-sm)', color: 'var(--danger)' }}><Trash2 size={13} /> Delete</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {truncate(project.description, 150)}
        </p>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 24, background: 'linear-gradient(transparent, var(--surface))', pointerEvents: 'none' }} />
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {tags.map((t) => (
          <span key={t} style={{ fontSize: 11, padding: '2px 10px', borderRadius: 99, background: 'var(--surface-3)', color: 'var(--text-3)' }}>{t}</span>
        ))}
        {project.tags.length > 3 && <span style={{ fontSize: 11, color: 'var(--text-2)', padding: '2px 0' }}>+{project.tags.length - 3}</span>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--text-2)', display: 'flex', padding: 4 }}><Github size={16} /></a>}
          {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--text-2)', display: 'flex', padding: 4 }}><ExternalLink size={16} /></a>}
        </div>
      </div>

      {confirming && (
        <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
          <button onClick={() => { onDelete(project.id); setConfirming(false); }} className="btn-danger" style={{ fontSize: 11, padding: '4px 8px', borderRadius: 'var(--radius-sm)' }}>Confirm</button>
          <button onClick={() => setConfirming(false)} className="btn-ghost" style={{ fontSize: 11, padding: '4px 8px', borderRadius: 'var(--radius-sm)' }}>Cancel</button>
        </div>
      )}
    </motion.div>
  );
}
