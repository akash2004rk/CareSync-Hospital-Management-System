import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../store/authSlice.js';
import toast from 'react-hot-toast';

function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((s) => s.auth);

  useEffect(() => {
    if (user) navigate(`/${user.role}`, { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    return () => { dispatch(clearError()); };
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
      toast.success(`Welcome back, ${result.payload.name}!`);
      navigate(`/${result.payload.role}`);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'var(--bg-primary)',
    }}>
      {/* Left decorative panel */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.15) 100%)',
        borderRight: '1px solid var(--border-light)',
        padding: 48,
      }} className="hide-mobile">
        <div style={{ fontSize: 72, marginBottom: 20 }}>🏥</div>
        <h2 style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', marginBottom: 12 }}>
          Welcome back to<br />
          <span style={{
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>CareSync</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.7, maxWidth: 320 }}>
          Manage your healthcare journey with our intelligent hospital management platform.
        </p>
        <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 280 }}>
          {['📅 Smart appointment booking', '📋 Secure medical records', '👨‍⚕️ Verified specialists', '🔔 Real-time updates'].map(t => (
            <div key={t} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border-light)',
              borderRadius: 8, padding: '10px 14px',
              fontSize: 13, color: 'var(--text-secondary)',
            }}>{t}</div>
          ))}
        </div>
      </div>

      {/* Login form */}
      <div style={{
        width: 480, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 40,
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ marginBottom: 32, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>👋</div>
            <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Sign in</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              Enter your credentials to access your portal
            </p>
          </div>

          {error && (
            <div className="alert alert-danger" style={{ marginBottom: 16 }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="doctor@hospital.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
              />
            </div>

            <button
              id="login-submit"
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={loading}
              style={{ marginTop: 4 }}
            >
              {loading ? '⏳ Signing in...' : '🔐 Sign In'}
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: 'center', fontSize: 14, color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 500, textDecoration: 'none' }}>
              Create one
            </Link>
          </div>

          <div className="divider" style={{ margin: '24px 0' }} />

          <Link to="/" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            color: 'var(--text-muted)', fontSize: 13, textDecoration: 'none',
          }}>
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
