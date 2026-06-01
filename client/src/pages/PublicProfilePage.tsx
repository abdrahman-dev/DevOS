import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Globe, GitBranch, ExternalLink, Terminal } from 'lucide-react';
import { profileService } from '../services/profile';
import EmptyState from '../components/ui/EmptyState';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function PublicProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'projects' | 'learning'>('projects');

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    setError(null);
    profileService.getPublicProfile(username)
      .then((res) => { setProfile(res.user); })
      .catch((err) => { setError(err.message ?? 'Failed to load profile'); })
      .finally(() => { setLoading(false); });
  }, [username]);

  useEffect(() => {
    document.title = profile ? `${profile.name} — DevOS` : 'Profile — DevOS';
  }, [profile]);

  if (loading) return <div className="loading-bar" />;

  if (error) {
    const isPrivate = error.toLowerCase().includes('private') || error.toLowerCase().includes('403');
    return (
      <motion.div
        className="profile-page"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.18, ease: 'easeOut' }}
        style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}
      >
        <EmptyState message={isPrivate ? 'This profile is private' : 'Profile not found'} />
      </motion.div>
    );
  }

  if (!profile) return null;

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
          {profile.avatar
            ? <img src={profile.avatar} alt={profile.name} className="profile-avatar" />
            : <div className="profile-avatar-placeholder">
                {profile.name?.[0]?.toUpperCase() ?? '?'}
              </div>
          }
        </div>

        <h2 className="profile-name">{profile.name}</h2>
        {profile.username && <p className="profile-username">@{profile.username}</p>}
        {profile.bio && <p className="profile-bio">{profile.bio}</p>}

        {profile.location && (
          <div className="profile-meta-item">
            <MapPin size={13} /> {profile.location}
          </div>
        )}
        {profile.website && (
          <a href={profile.website} target="_blank" className="profile-meta-item" rel="noreferrer">
            <Globe size={13} /> {profile.website}
          </a>
        )}

        <div className="profile-socials">
          {profile.socials?.github && (
            <a href={`https://github.com/${profile.socials.github}`} target="_blank" aria-label="GitHub" rel="noreferrer">
              <GitBranch size={16} />
            </a>
          )}
          {profile.socials?.linkedin && (
            <a href={`https://linkedin.com/in/${profile.socials.linkedin}`} target="_blank" aria-label="LinkedIn" rel="noreferrer">
              <ExternalLink size={16} />
            </a>
          )}
          {profile.socials?.twitter && (
            <a href={`https://twitter.com/${profile.socials.twitter}`} target="_blank" aria-label="Twitter" rel="noreferrer">
              <ExternalLink size={16} />
            </a>
          )}
          {profile.socials?.devto && (
            <a href={`https://dev.to/${profile.socials.devto}`} target="_blank" aria-label="DEV.to" rel="noreferrer">
              <Terminal size={16} />
            </a>
          )}
        </div>
      </div>

      <div className="profile-tabs">
        <div className="profile-tab-header">
          <button
            className={`profile-tab-btn${tab === 'projects' ? ' active' : ''}`}
            onClick={() => setTab('projects')}
          >
            Projects
          </button>
          <button
            className={`profile-tab-btn${tab === 'learning' ? ' active' : ''}`}
            onClick={() => setTab('learning')}
          >
            Learning
          </button>
        </div>

        <div className="profile-tab-content">
          {tab === 'projects'
            ? <EmptyState message="No public projects yet." />
            : <EmptyState message="Nothing shared yet." />
          }
        </div>
      </div>
    </motion.div>
  );
}
