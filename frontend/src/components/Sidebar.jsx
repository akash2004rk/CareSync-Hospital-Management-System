import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { logoutUser } from '../store/authSlice.js';
import toast from 'react-hot-toast';

const NAV = {
  admin: [
    { to: '/admin',           label: 'Dashboard',  icon: '🏥' },
    { to: '/admin/doctors',   label: 'Doctors',    icon: '👨‍⚕️' },
    { to: '/admin/patients',  label: 'Patients',   icon: '🧑‍🤝‍🧑' },
    { to: '/admin/analytics', label: 'Analytics',  icon: '📊' },
  ],
  doctor: [
    { to: '/doctor',         label: 'Dashboard', icon: '🏥' },
    { to: '/doctor/profile', label: 'My Profile', icon: '👤' },
    { to: '/doctor/slots',   label: 'My Slots',   icon: '📅' },
  ],
  patient: [
    { to: '/patient',         label: 'Dashboard',    icon: '🏥' },
    { to: '/patient/book',    label: 'Book Appointment', icon: '📅' },
    { to: '/patient/records', label: 'Medical Records',  icon: '📋' },
  ],
};

const ROLE_COLORS = {
  admin:   { from: '#3b82f6', to: '#8b5cf6' },
  doctor:  { from: '#10b981', to: '#06b6d4' },
  patient: { from: '#f59e0b', to: '#ef4444' },
};

function Sidebar({ role, user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const navItems = NAV[role] || [];
  const colors = ROLE_COLORS[role] || ROLE_COLORS.patient;
  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2) || '?';

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="btn-icon"
        id="sidebar-toggle"
        style={{ position:'fixed', top:14, left:14, zIndex:200, display:'none' }}
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle sidebar"
      >
        ☰
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position:'fixed', inset:0, background:'rgba(0,0,0,0.5)',
            zIndex:150, display:'none',
          }}
          className="sidebar-overlay"
        />
      )}

      <aside
        id="sidebar"
        style={{
          position: 'fixed',
          top: 0, left: 0,
          height: '100vh',
          width: 'var(--sidebar-width)',
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-light)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 100,
          overflow: 'hidden',
          transition: 'transform 0.3s ease',
        }}
      >
        {/* Brand */}
        <div style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid var(--border-light)',
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{
              width:36, height:36, borderRadius:10,
              background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:18, flexShrink:0,
            }}>
              🏥
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:15, color:'var(--text-primary)' }}>
                <span style={{
                  fontSize: 20, fontWeight: 800,
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>CareSync</span>
              </div>
              <div style={{
                fontSize:11, fontWeight:500, textTransform:'uppercase', letterSpacing:'0.08em',
                background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
              }}>
                {role} portal
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'12px 10px', overflowY:'auto' }}>
          <div style={{ fontSize:11, fontWeight:600, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em', padding:'8px 10px', marginBottom:4 }}>
            Menu
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === `/${role}`}
              onClick={() => setOpen(false)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 8,
                marginBottom: 2,
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: isActive ? `linear-gradient(90deg, ${colors.from}22, ${colors.to}11)` : 'transparent',
                borderLeft: isActive ? `3px solid ${colors.from}` : '3px solid transparent',
                transition: 'all 0.15s',
              })}
            >
              <span style={{ fontSize:18, lineHeight:1 }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div style={{
          padding: '14px 16px',
          borderTop: '1px solid var(--border-light)',
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
            <div className="avatar" style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})` }}>
              {initials}
            </div>
            <div style={{ minWidth:0, flex:1 }}>
              <div style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {user?.name}
              </div>
              <div style={{ fontSize:11, color:'var(--text-muted)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {user?.email}
              </div>
            </div>
          </div>
          <button
            id="logout-btn"
            onClick={handleLogout}
            className="btn btn-ghost btn-full btn-sm"
            style={{ justifyContent:'center' }}
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      <style>{`
        @media (max-width: 768px) {
          #sidebar-toggle { display: flex !important; }
          .sidebar-overlay { display: block !important; }
          #sidebar {
            transform: translateX(${open ? '0' : '-100%'});
          }
        }
      `}</style>
    </>
  );
}

export default Sidebar;
