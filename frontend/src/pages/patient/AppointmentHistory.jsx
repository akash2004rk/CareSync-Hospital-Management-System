import { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import toast from 'react-hot-toast';
import { LuRefreshCcw } from 'react-icons/lu';

function AppointmentHistory() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/appointments')
      .then(res => setAppointments(Array.isArray(res.data) ? res.data : (res.data.appointments || [])))
      .catch(() => toast.error('Failed to load appointment history'))
      .finally(() => setLoading(false));
  }, []);

  const statusBadge = (s) => {
    const map = { pending:'badge-warning', confirmed:'badge-info', completed:'badge-success', cancelled:'badge-danger' };
    return <span className={`badge ${map[s] || 'badge-info'}`}>{s}</span>;
  };

  const past = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled');
  const upcoming = appointments.filter(a => a.status === 'pending' || a.status === 'confirmed');

  if (loading) return <div className="loader-wrapper"><div className="spinner" /></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Appointment History</h1>
          <p className="page-subtitle">Track your past consultations and upcoming visits</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div className="stat-card" style={{ padding: '8px 16px', minWidth: 120 }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{upcoming.length}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Upcoming</div>
          </div>
          <div className="stat-card" style={{ padding: '8px 16px', minWidth: 120 }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{past.length}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Past Sessions</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <h2 className="section-title">Upcoming Appointments</h2>
        {upcoming.length === 0 ? (
          <p style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No upcoming appointments scheduled.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Specialization</th>
                  <th>Date</th>
                  <th>Time Slot</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {upcoming.map(a => (
                  <tr key={a._id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Dr. {a.doctorId?.name}</div>
                    </td>
                    <td><span className="badge badge-info">{a.doctorId?.specialization || 'General'}</span></td>
                    <td>{a.date}</td>
                    <td>{a.timeSlot}</td>
                    <td>{statusBadge(a.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="section-title">Past History</h2>
        {past.length === 0 ? (
          <p style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No past appointments found.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Reason</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {past.map(a => (
                  <tr key={a._id}>
                    <td style={{ fontWeight: 500 }}>Dr. {a.doctorId?.name}</td>
                    <td>{a.date}</td>
                    <td>{statusBadge(a.status)}</td>
                    <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.reason}</td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => toast.success('Re-booking feature coming soon!')}>
                        <LuRefreshCcw size={14}/> Re-book
                      </button>
                    </td>
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

export default AppointmentHistory;
