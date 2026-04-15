import { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import toast from 'react-hot-toast';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, apptRes] = await Promise.all([
          api.get('/analytics/admin'),
          api.get('/appointments'),
        ]);
        // Backend returns { stats: {...}, chartData, statusDistribution }
        setStats(statsRes.data.stats);
        setAppointments(apptRes.data.slice(0, 8));
      } catch {
        toast.error('Failed to load dashboard data');
      } finally { setLoading(false); }
    };
    load();
  }, []);

  const statusBadge = (s) => {
    const map = { pending:'badge-warning', confirmed:'badge-info', completed:'badge-success', cancelled:'badge-danger' };
    return <span className={`badge ${map[s] || 'badge-info'}`}>{s}</span>;
  };

  if (loading) return <div className="loader-wrapper"><div className="spinner" /></div>;

  return (
    <div className="page-container" style={{ animation: 'fadeIn 0.3s ease' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Hospital overview and operations</p>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          {new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Doctors',      value: stats?.totalDoctors        ?? '—', icon: '👨‍⚕️', color: 'blue'   },
          { label: 'Total Patients',     value: stats?.totalPatients       ?? '—', icon: '🧑‍🤝‍🧑', color: 'green'  },
          { label: "Today's Appts",      value: stats?.todayAppointments   ?? '—', icon: '📅', color: 'yellow' },
          { label: 'Revenue (₹)',        value: stats?.revenue             ?? '—', icon: '💰', color: 'purple' },
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

      {/* Recent Appointments */}
      <div className="card">
        <h2 className="section-title">Recent Appointments</h2>
        {appointments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📅</div>
            <h3>No appointments yet</h3>
            <p>Appointments will appear here once booked</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(a => (
                  <tr key={a._id}>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{a.patientId?.name || 'N/A'}</td>
                    <td>{a.doctorId?.name || 'N/A'}</td>
                    <td>{a.date}</td>
                    <td>{a.timeSlot}</td>
                    <td>{statusBadge(a.status)}</td>
                    <td style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
