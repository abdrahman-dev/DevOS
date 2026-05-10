import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, Lock, Copy, GitBranch,
  FolderOpen, BookOpen, Plug, LayoutDashboard, Shield, Terminal,
} from 'lucide-react';
import { useState } from 'react';
import AppLogo from '../components/ui/AppLogo';

const features = [
  { icon: <FolderOpen size={20} />, title: 'Project Tracker', desc: 'Track every project with status, priority, GitHub links, and notes.' },
  { icon: <BookOpen size={20} />, title: 'Learning Tracker', desc: "Monitor what you're studying with progress bars and sources." },
  { icon: <Plug size={20} />, title: '9 Integrations', desc: 'GitHub, WakaTime, Vercel, Railway, Render, Supabase, DEV.to, OpenRouter, Ollama.' },
  { icon: <LayoutDashboard size={20} />, title: 'Live Dashboard', desc: 'Real-time widgets from all your connected services in one view.' },
  { icon: <Shield size={20} />, title: 'Local First', desc: 'All data in IndexedDB. API keys never leave your device.' },
  { icon: <Terminal size={20} />, title: 'CLI Ready', desc: 'npx devos — spin up your dashboard from any terminal.' },
];

const integrations = ['GitHub', 'WakaTime', 'Vercel', 'Railway', 'Render', 'Supabase', 'DEV.to', 'OpenRouter', 'Ollama'];

export default function LandingPage() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('npx devos');
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

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
          Open Source · Local First · No Backend
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
          Track projects, monitor integrations, and stay in flow.<br />
          GitHub, WakaTime, Vercel, OpenRouter — all in one place.<br />
          Everything stored locally. Zero backend. Zero accounts required.
        </motion.p>

        <motion.div
          className="landing-hero-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <button className="landing-btn-primary" onClick={() => navigate('/dashboard')}>
            Continue as Guest
            <ArrowRight size={16} />
          </button>
          <button className="landing-btn-secondary" onClick={() => navigate('/dashboard')}>
            <Lock size={14} />
            Sign In
            <span className="landing-soon-chip">Soon</span>
          </button>
        </motion.div>

        <motion.div
          className="landing-install-box"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <span className="landing-install-prefix">$</span>
          <span className="landing-install-cmd">npx devos</span>
          <button className="landing-install-copy" onClick={handleCopy}>
            <Copy size={13} />
          </button>
          {copied && <span className="landing-copied">Copied!</span>}
        </motion.div>
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

      <section className="landing-integrations">
        <p className="landing-integrations-label">Connect your favorite tools</p>
        <div className="landing-integrations-row">
          {integrations.map(name => (
            <div key={name} className="landing-integration-chip">{name}</div>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-footer-left">
          <AppLogo size={20} />
          <span>DevOS</span>
          <span style={{ color: 'var(--text-2)', fontSize: 12 }}>MIT License</span>
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
