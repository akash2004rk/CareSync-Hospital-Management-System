import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import { LuCalendar as Calendar, LuUserCheck as UserCheck, LuFileText as FileText, LuChartBar as BarChart, LuBell as Bell, LuShield as Shield, LuHeartPulse as HeartPulse, LuActivity as Activity, LuUsers as Users, LuStethoscope as Stethoscope } from 'react-icons/lu';

const FEATURES = [
  { icon: <Calendar size={24} />, title: 'Smart Scheduling', desc: 'Book and manage appointments with real-time slot availability across all departments.' },
  { icon: <UserCheck size={24} />, title: 'Verified Doctors', desc: 'Access verified specialists with complete profiles, ratings, and consultation fees.' },
  { icon: <FileText size={24} />, title: 'Medical Records', desc: 'Store and access prescriptions, lab reports, and scan records securely in one place.' },
  { icon: <BarChart size={24} />, title: 'Analytics Dashboard', desc: 'Administrators gain comprehensive insights into hospital operations and patient flow.' },
  { icon: <Bell size={24} />, title: 'Real-time Notifications', desc: 'Stay informed with instant updates on appointment statuses and medical alerts.' },
  { icon: <Shield size={24} />, title: 'Secure & Private', desc: 'Enterprise-grade security protecting sensitive patient and hospital data at all times.' },
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
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    if (user) navigate(`/${user.role}`, { replace: true });
  }, [user, navigate]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(10,15,30,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-light)',
        padding: '0 24px',
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

        {/* Desktop Nav */}
        <div className="hide-mobile" style={{ display: 'flex', gap: 10 }}>
          <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="btn-icon" 
          style={{ display: 'none' }} 
          id="nav-toggle"
          onClick={() => setIsNavOpen(!isNavOpen)}
        >
          {isNavOpen ? '✕' : '☰'}
        </button>

        {/* Mobile Menu */}
        {isNavOpen && (
          <div style={{
            position: 'absolute', top: 64, left: 0, right: 0,
            background: 'var(--bg-secondary)',
            padding: 20, borderBottom: '1px solid var(--border)',
            display: 'flex', flexDirection: 'column', gap: 12,
            zIndex: 100, boxShadow: 'var(--shadow-lg)'
          }}>
            <Link to="/login" className="btn btn-ghost btn-full" onClick={() => setIsNavOpen(false)}>Login</Link>
            <Link to="/register" className="btn btn-primary btn-full" onClick={() => setIsNavOpen(false)}>Get Started</Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section style={{
        padding: 'clamp(40px, 10vh, 100px) 24px',
        textAlign: 'center',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 70%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ position: 'relative', maxWidth: 800, margin: '0 auto' }}>
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
            fontSize: 'var(--fs-h1)',
            fontWeight: 800, lineHeight: 1.1,
            marginBottom: 20,
            letterSpacing: '-0.02em',
          }}>
            Healthcare{' '}
            <span style={{
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Reimagined</span>
            <br />for the Modern Age
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.125rem)', color: 'var(--text-secondary)', lineHeight: 1.7,
            marginBottom: 36, maxWidth: 600, margin: '0 auto 36px',
          }}>
            A unified platform connecting patients, doctors, and administrators. 
            Streamline appointments, manage records, and deliver exceptional care.
          </p>

          <div 
            className="stack-mobile" 
            style={{ display: 'flex', gap: 14, justifyContent: 'center' }}
          >
            <Link to="/register" className="btn btn-primary btn-lg w-full-mobile">
              🚀 Get Started Free
            </Link>
            <Link to="/login" className="btn btn-ghost btn-lg w-full-mobile">
              Login to Portal
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section style={{
        padding: '40px 24px',
        borderTop: '1px solid var(--border-light)',
        borderBottom: '1px solid var(--border-light)',
      }}>
        <div style={{
          maxWidth: 1000, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '24px 16px', textAlign: 'center',
        }}>
          {STATS.map((s) => (
            <div key={s.label}>
              <div style={{
                fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800,
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 'var(--fs-h2)', fontWeight: 700, marginBottom: 12 }}>
            Everything you need in one place
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 48, maxWidth: 600, margin: '0 auto 48px' }}>
            Comprehensive tools for every stakeholder in the healthcare ecosystem
          </p>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 20,
            }}>
            {FEATURES.map((f) => (
              <motion.div 
                key={f.title} 
                className="card" 
                style={{ cursor: 'default' }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
                }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 10, background: 'var(--accent-light)', color: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 14,
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Role cards */}
      <section style={{
        padding: '60px 24px',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-light)',
        borderBottom: '1px solid var(--border-light)',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 700, marginBottom: 36 }}>
            Choose your portal
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {[
              { role: 'Patient', icon: <Users size={40} />, color: '#f59e0b', desc: 'Book appointments, view records, and manage your healthcare journey.' },
              { role: 'Doctor',  icon: <Stethoscope size={40} />, color: '#10b981', desc: 'Manage your schedule, patients, prescriptions and profile.' },
            ].map((r) => (
              <div key={r.role} className="card" style={{ textAlign: 'center', borderTop: `3px solid ${r.color}` }}>
                <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center', color: r.color }}>{r.icon}</div>
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
        padding: '32px 24px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: 13,
        borderTop: '1px solid var(--border-light)',
      }}>
        <div style={{ fontSize: 18, marginBottom: 8 }}>🏥 CareSync</div>
        <p>© {new Date().getFullYear()} CareSync Hospital Management System. All rights reserved.</p>
      </footer>
      <style>{`
        @media (max-width: 768px) {
          #nav-toggle { display: flex !important; }
          .hero-section { padding: 60px 20px !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .roles-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export default LandingPage;
