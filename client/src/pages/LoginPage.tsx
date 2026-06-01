import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FolderOpen, BookOpen, GitBranch, Crosshair, ArrowLeft } from 'lucide-react';
import AppLogo from '../components/ui/AppLogo';
import AnimatedBackground from '../components/ui/AnimatedBackground';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/auth';

const floatItems = [
  { icon: <FolderOpen size={16} />, text: 'Track your projects' },
  { icon: <BookOpen size={16} />, text: 'Monitor your learning' },
  { icon: <GitBranch size={16} />, text: 'GitHub integration' },
  { icon: <Crosshair size={16} />, text: 'Stay in flow' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const step = searchParams.get('step') as 'verify-email' | 'forgot-password' | 'reset-password' | null;
  const emailParam = searchParams.get('email') ?? '';

  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);

  const [email, setEmail] = useState(emailParam);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const [resending, setResending] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const currentStep = step ?? 'login';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.message ?? 'Login failed';
      if (msg.toLowerCase().includes('not verified') || msg.toLowerCase().includes('verify')) {
        setSearchParams({ step: 'verify-email', email });
      } else {
        setError(msg);
      }
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await authService.verifyEmail(email, otp);
      navigate('/login');
    } catch (err: any) {
      setError(err.message ?? 'Verification failed');
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    try {
      await authService.resendOtp(email);
    } catch {}
    setResending(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await authService.forgotPassword(email);
      setSearchParams({ step: 'reset-password', email });
    } catch (err: any) {
      setError(err.message ?? 'Request failed');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await authService.resetPassword(email, otp, newPassword);
      navigate('/login');
    } catch (err: any) {
      setError(err.message ?? 'Reset failed');
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
            {currentStep === 'login' && (
              <form onSubmit={handleLogin}>
                <h1 className="auth-form-title">Welcome back</h1>
                <p className="auth-form-sub">Sign in to your DevOS account</p>
                <div className="auth-field">
                  <label>Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                </div>
                <div className="auth-field">
                  <label>Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                </div>
                {error && <p className="auth-error">{error}</p>}
                <button type="submit" className="btn-primary auth-submit" disabled={loading}>
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
                <div className="auth-link-row">
                  <button type="button" onClick={() => setSearchParams({ step: 'forgot-password', email })}>Forgot password?</button>
                </div>
                <div className="auth-divider">or</div>
                <div className="auth-link-row">
                  Don&apos;t have an account? <a href="/register" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Sign up</a>
                </div>
              </form>
            )}

            {currentStep === 'verify-email' && (
              <form onSubmit={handleVerifyEmail}>
                <h1 className="auth-form-title">Verify your email</h1>
                <p className="auth-form-sub">We sent a code to {email}</p>
                <div className="auth-field">
                  <label>Verification Code</label>
                  <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="000000" maxLength={6} required />
                </div>
                {error && <p className="auth-error">{error}</p>}
                <button type="submit" className="btn-primary auth-submit">Verify</button>
                <div className="auth-link-row">
                  Didn&apos;t get it? <button type="button" onClick={handleResendOtp} disabled={resending}>{resending ? 'Sending…' : 'Resend code'}</button>
                </div>
              </form>
            )}

            {currentStep === 'forgot-password' && (
              <form onSubmit={handleForgotPassword}>
                <h1 className="auth-form-title">Forgot password</h1>
                <p className="auth-form-sub">Enter your email and we&apos;ll send you a reset code</p>
                <div className="auth-field">
                  <label>Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                </div>
                {error && <p className="auth-error">{error}</p>}
                <button type="submit" className="btn-primary auth-submit" disabled={loading}>
                  {loading ? 'Sending…' : 'Send Reset Code'}
                </button>
                <div className="auth-link-row">
                  <button type="button" onClick={() => setSearchParams({})}>Back to sign in</button>
                </div>
              </form>
            )}

            {currentStep === 'reset-password' && (
              <form onSubmit={handleResetPassword}>
                <h1 className="auth-form-title">Reset password</h1>
                <p className="auth-form-sub">Enter the code sent to {email} and your new password</p>
                <div className="auth-field">
                  <label>Reset Code</label>
                  <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="000000" maxLength={6} required />
                </div>
                <div className="auth-field">
                  <label>New Password</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" required />
                </div>
                <div className="auth-field">
                  <label>Confirm Password</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" required />
                </div>
                {error && <p className="auth-error">{error}</p>}
                <button type="submit" className="btn-primary auth-submit" disabled={loading}>
                  {loading ? 'Resetting…' : 'Reset Password'}
                </button>
                <div className="auth-link-row">
                  <button type="button" onClick={() => setSearchParams({})}>Back to sign in</button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}
