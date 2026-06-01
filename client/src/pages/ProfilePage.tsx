import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Globe, GitBranch, ExternalLink, Pencil, Terminal } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useProjectsStore } from '../store/projectsStore';
import { useLearningStore } from '../store/learningStore';
import { profileService } from '../services/profile';
import { useToast } from '../hooks/useToast';
import { useRequireAuth } from '../hooks/useRequireAuth';
import Modal from '../components/ui/Modal';
import ProjectCard from '../components/cards/ProjectCard';
import StatusBadge from '../components/ui/StatusBadge';
import EmptyState from '../components/ui/EmptyState';
import ToastContainer from '../components/ui/Toast';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function ProfilePage() {
  useRequireAuth();
  const user = useAuthStore((s) => s.user);
  const projects = useProjectsStore((s) => s.projects);
  const learningItems = useLearningStore((s) => s.items);
  const { toasts, showToast, removeToast } = useToast();

  const [tab, setTab] = useState<'projects' | 'learning'>('projects');
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState(user?.name ?? '');
  const [username, setUsername] = useState(user?.username ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [avatar, setAvatar] = useState(user?.avatar ?? '');
  const [location, setLocation] = useState(user?.location ?? '');
  const [website, setWebsite] = useState(user?.website ?? '');
  const [socialGithub, setSocialGithub] = useState(user?.socials?.github ?? '');
  const [socialLinkedin, setSocialLinkedin] = useState(user?.socials?.linkedin ?? '');
  const [socialTwitter, setSocialTwitter] = useState(user?.socials?.twitter ?? '');
  const [socialDevto, setSocialDevto] = useState(user?.socials?.devto ?? '');
  const [isProfilePublic, setIsProfilePublic] = useState(user?.isProfilePublic ?? true);

  useEffect(() => {
    document.title = 'Profile — DevOS';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (editOpen && user) {
      setName(user.name ?? '');
      setUsername(user.username ?? '');
      setBio(user.bio ?? '');
      setAvatar(user.avatar ?? '');
      setLocation(user.location ?? '');
      setWebsite(user.website ?? '');
      setSocialGithub(user.socials?.github ?? '');
      setSocialLinkedin(user.socials?.linkedin ?? '');
      setSocialTwitter(user.socials?.twitter ?? '');
      setSocialDevto(user.socials?.devto ?? '');
      setIsProfilePublic(user.isProfilePublic ?? true);
    }
  }, [editOpen, user]);

  if (!user) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await profileService.updateProfile({
        name,
        username: username || undefined,
        bio,
        avatar: avatar || undefined,
        location,
        website: website || undefined,
        socials: {
          github: socialGithub,
          linkedin: socialLinkedin,
          twitter: socialTwitter,
          devto: socialDevto,
        },
        isProfilePublic,
      });
      useAuthStore.setState({ user: res.user as any });
      setEditOpen(false);
      showToast('Profile updated', 'success');
    } catch (err: any) {
      showToast(err.message ?? 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      className="profile-page"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      <div className="profile-card">
        <div className="profile-avatar-wrap">
          {user.avatar
            ? <img src={user.avatar} alt={user.name} className="profile-avatar" />
            : <div className="profile-avatar-placeholder">
                {user.name?.[0]?.toUpperCase() ?? '?'}
              </div>
          }
        </div>

        <h2 className="profile-name">{user.name}</h2>
        {user.username && <p className="profile-username">@{user.username}</p>}
        {user.bio && <p className="profile-bio">{user.bio}</p>}

        <div className="profile-stats">
          <div className="profile-stat">
            <span className="profile-stat-value">{projects.length}</span>
            <span className="profile-stat-label">Projects</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat-value">{learningItems.length}</span>
            <span className="profile-stat-label">Learning</span>
          </div>
        </div>

        {user.location && (
          <div className="profile-meta-item">
            <MapPin size={13} /> {user.location}
          </div>
        )}
        {user.website && (
          <a href={user.website} target="_blank" className="profile-meta-item" rel="noreferrer">
            <Globe size={13} /> {user.website}
          </a>
        )}

        <div className="profile-socials">
          {user.socials?.github && (
            <a href={`https://github.com/${user.socials.github}`} target="_blank" aria-label="GitHub" rel="noreferrer">
              <GitBranch size={16} />
            </a>
          )}
          {user.socials?.linkedin && (
            <a href={`https://linkedin.com/in/${user.socials.linkedin}`} target="_blank" aria-label="LinkedIn" rel="noreferrer">
              <ExternalLink size={16} />
            </a>
          )}
          {user.socials?.twitter && (
            <a href={`https://twitter.com/${user.socials.twitter}`} target="_blank" aria-label="Twitter" rel="noreferrer">
              <ExternalLink size={16} />
            </a>
          )}
          {user.socials?.devto && (
            <a href={`https://dev.to/${user.socials.devto}`} target="_blank" aria-label="DEV.to" rel="noreferrer">
              <Terminal size={16} />
            </a>
          )}
        </div>

        <button className="btn-edit" onClick={() => setEditOpen(true)} style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}>
          <Pencil size={14} /> Edit Profile
        </button>
      </div>

      <div className="profile-tabs">
        <div className="profile-tab-header">
          <button
            className={`profile-tab-btn${tab === 'projects' ? ' active' : ''}`}
            onClick={() => setTab('projects')}
          >
            Projects ({projects.length})
          </button>
          <button
            className={`profile-tab-btn${tab === 'learning' ? ' active' : ''}`}
            onClick={() => setTab('learning')}
          >
            Learning ({learningItems.length})
          </button>
        </div>

        <div className="profile-tab-content">
          {tab === 'projects' && (
            projects.length === 0
              ? <EmptyState message="No public projects yet." />
              : projects.map((p) => (
                  <ProjectCard key={p.id} project={p} onEdit={() => {}} onDelete={() => {}} />
                ))
          )}
          {tab === 'learning' && (
            learningItems.length === 0
              ? <EmptyState message="Nothing shared yet." />
              : learningItems.map((item) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{item.topic}</div>
                      {item.source && <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2 }}>{item.source}</div>}
                      <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 4, background: 'var(--surface-3)', borderRadius: 99, overflow: 'hidden', maxWidth: 200 }}>
                          <div style={{ height: '100%', width: `${item.progress}%`, background: 'var(--accent)', borderRadius: 99, transition: 'width 0.3s' }} />
                        </div>
                        <span style={{ fontSize: 11, color: 'var(--text-2)' }}>{item.progress}%</span>
                      </div>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                ))
          )}
        </div>
      </div>

      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Profile">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: 14 }}>
          <div className="auth-field">
            <label>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>

          <div className="auth-field">
            <label>Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} placeholder="username" />
            <span style={{ fontSize: 11, color: 'var(--text-2)' }}>Lowercase letters, numbers, underscores, hyphens</span>
          </div>

          <div className="auth-field">
            <label>Bio</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={200} placeholder="Tell us about yourself…" style={{ resize: 'vertical', minHeight: 60, fontFamily: 'var(--font-sans)' }} />
            <span style={{ fontSize: 11, color: 'var(--text-2)', textAlign: 'right' }}>{bio.length}/200</span>
          </div>

          <div className="auth-field">
            <label>Avatar URL</label>
            <input type="url" value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="https://…" />
          </div>

          <div className="auth-field">
            <label>Location</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, Country" />
          </div>

          <div className="auth-field">
            <label>Website</label>
            <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://…" />
          </div>

          <hr style={{ border: 'none', borderTop: '1.5px solid var(--border)' }} />

          <div className="auth-field">
            <label>GitHub Handle</label>
            <input type="text" value={socialGithub} onChange={(e) => setSocialGithub(e.target.value)} placeholder="username" />
          </div>

          <div className="auth-field">
            <label>LinkedIn Handle</label>
            <input type="text" value={socialLinkedin} onChange={(e) => setSocialLinkedin(e.target.value)} placeholder="username" />
          </div>

          <div className="auth-field">
            <label>Twitter Handle</label>
            <input type="text" value={socialTwitter} onChange={(e) => setSocialTwitter(e.target.value)} placeholder="username" />
          </div>

          <div className="auth-field">
            <label>DEV.to Handle</label>
            <input type="text" value={socialDevto} onChange={(e) => setSocialDevto(e.target.value)} placeholder="username" />
          </div>

          <hr style={{ border: 'none', borderTop: '1.5px solid var(--border)' }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ fontSize: 13, fontWeight: 600 }}>Public Profile</label>
            <button
              onClick={() => setIsProfilePublic(!isProfilePublic)}
              style={{
                width: 44, height: 24, borderRadius: 99,
                background: isProfilePublic ? 'var(--accent)' : 'var(--surface-3)',
                border: 'none', padding: 0, cursor: 'pointer',
                position: 'relative', transition: 'background 0.2s',
              }}
              aria-label={isProfilePublic ? 'Set profile private' : 'Set profile public'}
            >
              <span style={{
                position: 'absolute', top: 2, left: isProfilePublic ? 23 : 2,
                width: 20, height: 20, borderRadius: '50%',
                background: '#fff', transition: 'left 0.2s',
              }} />
            </button>
          </div>

          <button onClick={handleSave} className="btn-primary" disabled={saving} style={{ marginTop: 4, padding: 12, fontSize: 14, fontWeight: 700 }}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </motion.div>
  );
}
