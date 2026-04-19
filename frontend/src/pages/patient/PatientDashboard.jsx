import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../../api/axios.js';
import toast from 'react-hot-toast';
import { LuCalendarDays, LuClock, LuCircleCheck, LuCircleX, LuStethoscope } from 'react-icons/lu';

function PatientDashboard() {
  const { user } = useSelector(s => s.auth);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/appointments')
      .then(r => setAppointments(Array.isArray(r.data) ? r.data : (r.data.appointments || [])))
      .catch(() => toast.error('Failed to load appointments'))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await api.put(`/appointments/${id}`, { status: 'cancelled' });
      setAppointments(a => a.map(x => x._id === id ? { ...x, status: 'cancelled' } : x));
      toast.success('Appointment cancelled');
    } catch { toast.error('Failed to cancel appointment'); }
  };

  const statusBadge = (s) => {
    const map = { pending:'badge-warning', confirmed:'badge-info', completed:'badge-success', cancelled:'badge-danger' };
    return <span className={`badge ${map[s] || 'badge-info'}`}>{s}</span>;
  };

  const upcoming = appointments.filter(a => ['pending','confirmed'].includes(a.status));
  const past = appointments.filter(a => ['completed','cancelled'].includes(a.status));

  if (loading) return <div className="loader-wrapper"><div className="spinner" /></div>;

  return (
    <div className="page-container" >
      <div className="page-header">
        <div>
          <h1 className="page-title">Hello, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="page-subtitle">Manage your health appointments</p>
        </div>
        <Link to="/patient/book" className="btn btn-primary">+ Book Appointment</Link>
      </div>

      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Appointments', value: appointments.length, icon: <LuCalendarDays size={22}/>, color: 'blue' },
          { label: 'Upcoming',           value: upcoming.length,     icon: <LuClock size={22}/>,       color: 'yellow'},
          { label: 'Completed',          value: past.filter(a => a.status==='completed').length, icon: <LuCircleCheck size={22}/>, color: 'green' },
          { label: 'Cancelled',          value: past.filter(a => a.status==='cancelled').length, icon: <LuCircleX size={22}/>,   color: 'red'   },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className={`stat-icon ${s.color}`}>{s.icon}</div>
            <div className="stat-info">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h2 className="section-title">Upcoming Appointments</h2>
        {upcoming.length === 0 ? (
          <div className="empty-state" style={{ padding: '32px 20px' }}>
            <LuCalendarDays size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
            <h3>No upcoming appointments</h3>
            <p style={{ marginBottom:12 }}>Book your first appointment with our verified doctors</p>
            <Link to="/patient/book" className="btn btn-primary btn-sm">Book Now</Link>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {upcoming.map(a => (
              <div key={a._id} style={{
                display:'flex', alignItems:'center', gap:14, flexWrap:'wrap',
                background:'var(--bg-secondary)', padding:'14px 16px',
                borderRadius:'var(--radius-sm)', border:'1px solid var(--border-light)',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg,#10b981,#06b6d4)',
                  display:'flex', alignItems:'center', justifyContent:'center', color:'white'
                }}>
                  <LuStethoscope size={20}/>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:600, color:'var(--text-primary)', fontSize: 15 }}>{a.doctorId?.name || 'Doctor'}</div>
                  <div style={{ fontSize:13, color:'var(--text-muted)', marginTop: 2 }}>{a.date} at {a.timeSlot} · {a.reason}</div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:10, width:'100%', justifyContent:'space-between', marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border-light)' }} className="show-mobile-only">
                  {statusBadge(a.status)}
                  {a.status !== 'cancelled' && (
                    <button className="btn btn-danger btn-sm" onClick={() => handleCancel(a._id)}>Cancel</button>
                  )}
                </div>
                <div className="hide-mobile" style={{ display:'flex', alignItems:'center', gap:10 }}>
                  {statusBadge(a.status)}
                  {a.status !== 'cancelled' && (
                    <button className="btn btn-danger btn-sm" onClick={() => handleCancel(a._id)}>Cancel</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past */}
      {past.length > 0 && (
        <div className="card">
          <h2 className="section-title">Past Appointments</h2>
          
          {/* Desktop View */}
          <div className="table-wrapper hide-mobile">
            <table>
              <thead>
                <tr><th>Doctor</th><th>Date</th><th>Time</th><th>Reason</th><th>Status</th></tr>
              </thead>
              <tbody>
                {past.map(a => (
                  <tr key={a._id}>
                    <td style={{ fontWeight:500, color:'var(--text-primary)' }}>{a.doctorId?.name || 'N/A'}</td>
                    <td>{a.date}</td>
                    <td>{a.timeSlot}</td>
                    <td style={{ maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.reason}</td>
                    <td>{statusBadge(a.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="mobile-card-list show-mobile-only">
            {past.map(a => (
              <div key={a._id} className="mobile-card">
                <div className="mobile-card-header">
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{a.doctorId?.name || 'N/A'}</div>
                  {statusBadge(a.status)}
                </div>
                <div className="mobile-card-body">
                  <div className="mobile-card-item">
                    <span className="mobile-card-label">Schedule</span>
                    <span className="mobile-card-value">{a.date} · {a.timeSlot}</span>
                  </div>
                  <div className="mobile-card-item">
                    <span className="mobile-card-label">Reason</span>
                    <span className="mobile-card-value" style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.reason}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientDashboard;
