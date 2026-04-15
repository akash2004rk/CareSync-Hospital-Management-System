import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const FEATURES = [
  { icon: '🗓️', title: 'Smart Scheduling', desc: 'Book and manage appointments with real-time slot availability across all departments.' },
  { icon: '👨‍⚕️', title: 'Verified Doctors', desc: 'Access verified specialists with complete profiles, ratings, and consultation fees.' },
  { icon: '📋', title: 'Medical Records', desc: 'Store and access prescriptions, lab reports, and scan records securely in one place.' },
  { icon: '📊', title: 'Analytics Dashboard', desc: 'Administrators gain comprehensive insights into hospital operations and patient flow.' },
  { icon: '🔔', title: 'Real-time Notifications', desc: 'Stay informed with instant updates on appointment statuses and medical alerts.' },
  { icon: '🔒', title: 'Secure & Private', desc: 'Enterprise-grade security protecting sensitive patient and hospital data at all times.' },
];

const STATS = [
  { value: '200+', label: 'Verified Doctors' },
  { value: '15k+', label: 'Happy Patients' },
  { value: '50k+', label: 'Appointments' },
  { value: '99.9%', label: 'Uptime' },
];

function LandingPage() {
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate(`/${user.role}`, { replace: true });
  }, [user, navigate]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(10,15,30,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-light)',
        padding: '0 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 64,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 26 }}>🏥</span>
          <span style={{
            fontSize: 20, fontWeight: 800,
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>CareSync</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        padding: '80px 32px',
        textAlign: 'center',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 70%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative orbs */}
        <div style={{
          position: 'absolute', top: -80, left: '20%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: 0, right: '10%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)',
            borderRadius: 999, padding: '6px 16px', marginBottom: 24,
            fontSize: 13, color: 'var(--accent)',
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            Next-generation Hospital Management
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 800, lineHeight: 1.1,
            marginBottom: 20,
          }}>
            Healthcare{' '}
            <span style={{
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Reimagined</span>
            <br />for the Modern Age
          </h1>

          <p style={{
            fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.7,
            marginBottom: 36, maxWidth: 560, margin: '0 auto 36px',
          }}>
            A unified platform connecting patients, doctors, and administrators. 
            Streamline appointments, manage records, and deliver exceptional care.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              🚀 Get Started Free
            </Link>
            <Link to="/login" className="btn btn-ghost btn-lg">
              Login to Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{
        padding: '40px 32px',
        borderTop: '1px solid var(--border-light)',
        borderBottom: '1px solid var(--border-light)',
      }}>
        <div style={{
          maxWidth: 900, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 20, textAlign: 'center',
        }}>
          {STATS.map((s) => (
            <div key={s.label}>
              <div style={{
                fontSize: 36, fontWeight: 800,
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
            Everything you need in one place
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 48 }}>
            Comprehensive tools for every stakeholder in the healthcare ecosystem
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 20,
          }}>
            {FEATURES.map((f) => (
              <div key={f.title} className="card" style={{ cursor: 'default' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 10, background: 'var(--accent-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, marginBottom: 14,
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role cards */}
      <section style={{
        padding: '60px 32px',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-light)',
        borderBottom: '1px solid var(--border-light)',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 700, marginBottom: 36 }}>
            Choose your portal
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
            {[
              { role: 'Patient', icon: '🧑‍🤝‍🧑', color: '#f59e0b', desc: 'Book appointments, view records, and manage your healthcare journey.' },
              { role: 'Doctor',  icon: '👨‍⚕️', color: '#10b981', desc: 'Manage your schedule, patients, prescriptions and profile.' },
            ].map((r) => (
              <div key={r.role} className="card" style={{ textAlign: 'center', borderTop: `3px solid ${r.color}` }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>{r.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{r.role}</div>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16 }}>{r.desc}</p>
                <Link
                  to="/register"
                  className="btn btn-sm"
                  style={{ background: r.color + '22', color: r.color, border: `1px solid ${r.color}44` }}
                >
                  Register as {r.role}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '32px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: 13,
        borderTop: '1px solid var(--border-light)',
      }}>
        <div style={{ fontSize: 18, marginBottom: 8 }}>🏥 CareSync</div>
        <p>© {new Date().getFullYear()} CareSync Hospital Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
