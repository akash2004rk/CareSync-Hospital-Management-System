import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../store/authSlice.js';
import toast from 'react-hot-toast';
import { LuEye as Eye, LuEyeOff as EyeOff, LuMail as Mail, LuLock as Lock, LuUser as User, LuPhone as Phone } from 'react-icons/lu';
import { motion } from 'framer-motion';

function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'patient', phone: '' });
  const [showPwd, setShowPwd] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((s) => s.auth);

  useEffect(() => {
    if (user) navigate(`/${user.role}`, { replace: true });
  }, [user, navigate]);

  useEffect(() => () => { dispatch(clearError()); }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(result)) {
      toast.success('Account created successfully!');
      navigate(`/${result.payload.role}`);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: 'clamp(12px, 2vw, 32px)' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 500 }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>🏥</div>
          <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Create your account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Join CareSync today</p>
        </div>

        <div className="card" style={{ padding: 'clamp(20px, 5vw, 32px)' }}>
          {error && <div className="alert alert-danger" style={{ marginBottom: 18 }}>⚠️ {error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
                <input id="reg-name" type="text" className="form-input" style={{ paddingLeft: 38 }} placeholder="Dr. Jane Smith"
                  value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
                <input id="reg-email" type="email" className="form-input" style={{ paddingLeft: 38 }} placeholder="jane@hospital.com"
                  value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-phone">Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
                <input id="reg-phone" type="tel" className="form-input" style={{ paddingLeft: 38 }} placeholder="+91 98765 43210"
                  value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-role">Register As</label>
              <select id="reg-role" className="form-input"
                value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
                <input id="reg-password" type={showPwd ? 'text' : 'password'} className="form-input" style={{ paddingLeft: 38, paddingRight: 40 }} placeholder="Min 6 characters"
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required minLength={6} />
                <button
                  type="button"
                  tabIndex="-1"
                  onClick={() => setShowPwd(!showPwd)}
                  style={{
                    position: 'absolute', right: 8, top: 8,
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', padding: 4
                  }}
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button id="reg-submit" type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: 4 }}>
              {loading ? '⏳ Creating account...' : '✅ Create Account'}
            </button>
          </form>

          <div style={{ marginTop: 20, textAlign: 'center', fontSize: 14, color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 500, textDecoration: 'none' }}>Sign in</Link>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Link to="/" style={{ color: 'var(--text-muted)', fontSize: 13, textDecoration: 'none' }}>← Back to homepage</Link>
        </div>
      </motion.div>
    </div>
  );
}

export default RegisterPage;
