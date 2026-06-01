import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, Lock, GitBranch,
  FolderOpen, BookOpen, Plug, LayoutDashboard, Shield, Users,
} from 'lucide-react';
import AppLogo from '../components/ui/AppLogo';

const features = [
  {
    icon: <FolderOpen size={20} />,
    title: 'Project Tracker',
    desc: "Every idea you had, every project you started finally in one place. No more forgotten side projects.",
  },
  {
    icon: <BookOpen size={20} />,
    title: 'Learning Tracker',
    desc: "You're always learning something. Keep track of it, see how far you've come, and never lose your progress.",
  },
  {
    icon: <Plug size={20} />,
    title: 'Live Dashboard',
    desc: "Your GitHub activity, your repos, your stats all visible the moment you open your dashboard.",
  },
  {
    icon: <LayoutDashboard size={20} />,
    title: 'Local First',
    desc: "Your data belongs to you. Everything lives on your device. No servers reading your notes.",
  },
  {
    icon: <Shield size={20} />,
    title: 'Secure Auth',
    desc: "When you're ready to sync, your account is protected with JWT, httpOnly cookies, and email verification.",
  },
  {
    icon: <Users size={20} />,
    title: 'Developer Profiles',
    desc: "Share what you're building and learning with the world — on your terms, only what you choose.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <nav className="landing-nav">
        <AppLogo size={28} />
        <span className="landing-nav-name">DevOS</span>
        <div style={{ flex: 1 }} />
        <a href="https://github.com/abdrahman-dev/DevOS" target="_blank" rel="noreferrer" className="landing-nav-link">
          <GitBranch size={16} /> GitHub
        </a>
        <button className="landing-nav-cta" onClick={() => navigate('/dashboard')}>
          Open App →
        </button>
      </nav>

      <section className="landing-hero">
        <motion.div
          className="landing-hero-label"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="landing-label-dot" />
          Open Source · Built for Developers · Always Yours
        </motion.div>

        <motion.h1
          className="landing-hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Your personal<br />
          <span className="landing-gradient-text">developer OS</span>
        </motion.h1>

        <motion.p
          className="landing-hero-sub"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          The place where your ideas don't get lost.<br />
          Track what you build, remember what you learn,<br />
          and never lose sight of where you're going.
        </motion.p>

        <motion.div
          className="landing-hero-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <button className="landing-btn-primary" onClick={() => navigate('/dashboard')}>
            Start for Free
            <ArrowRight size={16} />
          </button>
          <button className="landing-btn-secondary" onClick={() => navigate('/login')}>
            <Lock size={14} />
            Sign In
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 12, textAlign: 'center' }}
        >
          No account needed to get started. Your data stays on your device.
        </motion.p>
      </section>

      <section className="landing-features">
        <motion.h2
          className="landing-section-title"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Everything you need in one place
        </motion.h2>

        <div className="landing-features-grid">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="landing-feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <div className="landing-feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-footer-left">
          <AppLogo size={20} />
          <span>DevOS</span>
          <span style={{ color: 'var(--text-2)', fontSize: 12 }}>Free & Open Source · MIT License</span>
        </div>
        <div className="landing-footer-right">
          <a href="https://github.com/abdrahman-dev/DevOS" target="_blank" rel="noreferrer">GitHub</a>
          <span style={{ color: 'var(--border)' }}>·</span>
          <span style={{ fontSize: 12, color: 'var(--text-2)' }}>Built by Abdrahman Walied</span>
        </div>
      </footer>
    </div>
  );
}
