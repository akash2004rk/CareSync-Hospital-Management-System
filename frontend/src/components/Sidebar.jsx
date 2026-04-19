import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { logoutUser } from '../store/authSlice.js';
import toast from 'react-hot-toast';
import { LuLayoutDashboard as LayoutDashboard, LuCalendarDays as CalendarDays, LuUsers as Users, LuStethoscope as Stethoscope, LuPill as Pill, LuChartBar as BarChart3, LuUser as User, LuClipboardList as ClipboardList, LuLogOut as LogOut, LuMenu as Menu, LuX as X, LuActivity as Activity } from 'react-icons/lu';
import UserAvatar from './UserAvatar.jsx';

const NAV = {
  admin: [
    { to: '/admin',           label: 'Dashboard',  icon: <LayoutDashboard size={20} /> },
    { to: '/admin/appointments', label: 'Appointments', icon: <CalendarDays size={20} /> },
    { to: '/admin/doctors',   label: 'Doctors',    icon: <Stethoscope size={20} /> },
    { to: '/admin/patients',  label: 'Patients',   icon: <Users size={20} /> },
    { to: '/admin/inventory', label: 'Pharmacy',   icon: <Pill size={20} /> },
    { to: '/admin/analytics', label: 'Analytics',  icon: <BarChart3 size={20} /> },
  ],
  doctor: [
    { to: '/doctor',         label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { to: '/doctor/patients',label: 'My Patients', icon: <Users size={20} /> },
    { to: '/doctor/profile', label: 'My Profile', icon: <User size={20} /> },
    { to: '/doctor/slots',   label: 'My Slots',   icon: <CalendarDays size={20} /> },
  ],
  patient: [
    { to: '/patient',         label: 'Dashboard',    icon: <LayoutDashboard size={20} /> },
    { to: '/patient/book',    label: 'Book Appointment', icon: <CalendarDays size={20} /> },
    { to: '/patient/history', label: 'Appt History',     icon: <ClipboardList size={20} /> },
    { to: '/patient/records', label: 'Medical Records',  icon: <Pill size={20} /> },
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

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="btn-icon"
        id="sidebar-toggle"
        style={{ 
          position:'fixed', top:12, right:12, zIndex:1100, display:'none',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          width: 40, height: 40, boxShadow: 'var(--shadow)',
          alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          borderRadius: 'var(--radius-sm)'
        }}
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle sidebar"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position:'fixed', inset:0, background:'rgba(0,0,0,0.6)',
            zIndex:1000, display:'none', backdropFilter: 'blur(4px)'
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
          height: '100dvh', // Modern viewport height
          width: 'var(--sidebar-width)',
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-light)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1050,
          overflow: 'hidden',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Brand */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid var(--border-light)',
          paddingTop: '64px' // Space for toggle on mobile
        }} className="sidebar-brand-area">
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{
              width:36, height:36, borderRadius:10,
              background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
              display:'flex', alignItems:'center', justifyContent:'center',
              color: 'white', flexShrink:0,
            }}>
              <Activity size={24} />
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

        <div style={{
          padding: '14px 16px',
          borderTop: '1px solid var(--border-light)',
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
            <UserAvatar name={user?.name || 'User'} size="sm" />
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
            style={{ justifyContent:'center', gap: 8 }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <style>{`
        @media (max-width: 768px) {
          #sidebar-toggle { display: flex !important; }
          .sidebar-overlay { display: block !important; }
          #sidebar {
            transform: translateX(${open ? '0' : '-100%'});
            box-shadow: ${open ? '0 0 40px rgba(0,0,0,0.5)' : 'none'};
          }
          .sidebar-brand-area { padding-top: 64px !important; }
        }
        @media (min-width: 769px) {
          .sidebar-brand-area { padding-top: 20px !important; }
        }
      `}</style>
    </>
  );
}

export default Sidebar;
