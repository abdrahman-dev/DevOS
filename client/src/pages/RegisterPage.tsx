import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, BookOpen, GitBranch, Crosshair, ArrowLeft } from 'lucide-react';
import AppLogo from '../components/ui/AppLogo';
import AnimatedBackground from '../components/ui/AnimatedBackground';
import { useAuthStore } from '../store/authStore';

const floatItems = [
  { icon: <FolderOpen size={16} />, text: 'Track your projects' },
  { icon: <BookOpen size={16} />, text: 'Monitor your learning' },
  { icon: <GitBranch size={16} />, text: 'GitHub integration' },
  { icon: <Crosshair size={16} />, text: 'Stay in flow' },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);
  const loading = useAuthStore((s) => s.loading);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const checks = [
    { label: 'At least 8 characters', pass: password.length >= 8 },
    { label: 'Uppercase letter', pass: /[A-Z]/.test(password) },
    { label: 'Lowercase letter', pass: /[a-z]/.test(password) },
    { label: 'Number', pass: /[0-9]/.test(password) },
    { label: 'Special character', pass: /[^A-Za-z0-9]/.test(password) },
  ];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await register(name, email, password);
      navigate(`/login?step=verify-email&email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(err.message ?? 'Registration failed');
    }
  };

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        background: 'rgba(13, 15, 20, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        zIndex: 100,
      }}>
        <div
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
        >
          <AppLogo size={24} />
          <span style={{
            fontWeight: 800,
            fontSize: 16,
            background: 'linear-gradient(135deg, var(--accent), var(--purple))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>DevOS</span>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="btn-ghost"
          style={{ fontSize: 12, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6, minHeight: 'auto' }}
        >
          <ArrowLeft size={14} /> Back
        </button>
      </nav>

      <div className="auth-page" style={{ paddingTop: 56 }}>
        <div className="auth-visual">
          <AnimatedBackground />
          <div className="auth-visual-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <AppLogo size={36} />
              <span style={{
                fontSize: 24,
                fontWeight: 800,
                fontFamily: 'var(--font-sans)',
                background: 'linear-gradient(135deg, var(--accent), var(--purple))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>DevOS</span>
            </div>

            <h2 className="auth-visual-title">
              The place where<br />
              <span className="landing-gradient-text">your ideas live</span>
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 24, maxWidth: 280 }}>
              Track projects, monitor learning, connect with developers all in one place.
            </p>

            {floatItems.map((item, i) => (
              <motion.div
                key={item.text}
                className="auth-float-card"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.4, ease: 'easeOut' }}
              >
                <span style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="auth-form-panel">
          <motion.div
            className="auth-form-box"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <form onSubmit={handleRegister}>
              <h1 className="auth-form-title">Create your account</h1>
              <p className="auth-form-sub">Join DevOS and start tracking your dev life</p>
              <div className="auth-field">
                <label>Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
              </div>
              <div className="auth-field">
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              <div className="auth-field">
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                <div className="password-checks">
                  {checks.map((c) => (
                    <div key={c.label} className={`password-check-item${c.pass ? ' pass' : ''}`}>
                      <span className="password-check-dot" />
                      <span>{c.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="auth-field">
                <label>Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" required />
              </div>
              {error && <p className="auth-error">{error}</p>}
              <button type="submit" className="btn-primary auth-submit" disabled={loading}>
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
              <div className="auth-divider">or</div>
              <div className="auth-link-row">
                Already have an account? <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Sign in</a>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
}
