import { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import toast from 'react-hot-toast';
import { LuCalendarDays } from 'react-icons/lu';

function ManageAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/appointments')
      .then(res => setAppointments(Array.isArray(res.data) ? res.data : (res.data.appointments || [])))
      .catch(() => toast.error('Failed to load appointments'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = appointments.filter(a => filter === 'all' || a.status === filter);

  const statusBadge = (s) => {
    const map = { pending:'badge-warning', confirmed:'badge-info', completed:'badge-success', cancelled:'badge-danger' };
    return <span className={`badge ${map[s] || 'badge-info'}`}>{s}</span>;
  };

  if (loading) return <div className="loader-wrapper"><div className="spinner" /></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Appointments</h1>
          <p className="page-subtitle">Overview of all system bookings — {appointments.length} total</p>
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <select
            className="form-input"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{ minWidth: 160 }}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <LuCalendarDays size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
            <h3>No appointments found</h3>
            <p>Try changing the filter or wait for new bookings</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="table-wrapper hide-mobile">
              <table>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Date</th>
                    <th>Time Slot</th>
                    <th>Status</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(a => (
                    <tr key={a._id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{a.patientId?.name || 'N/A'}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.patientId?.email}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{a.doctorId?.name || 'N/A'}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.doctorId?.specialization}</div>
                      </td>
                      <td>{a.date}</td>
                      <td>{a.timeSlot}</td>
                      <td>{statusBadge(a.status)}</td>
                      <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {a.reason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="mobile-card-list show-mobile-only">
              {filtered.map(a => (
                <div key={a._id} className="mobile-card">
                  <div className="mobile-card-header">
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{a.patientId?.name || 'N/A'}</div>
                    {statusBadge(a.status)}
                  </div>
                  <div className="mobile-card-body">
                    <div className="mobile-card-item">
                      <span className="mobile-card-label">Doctor</span>
                      <span className="mobile-card-value">{a.doctorId?.name || 'N/A'}</span>
                    </div>
                    <div className="mobile-card-item">
                      <span className="mobile-card-label">Schedule</span>
                      <span className="mobile-card-value">{a.date} · {a.timeSlot}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                    <span className="mobile-card-label" style={{ display: 'block', marginBottom: 2 }}>Reason</span>
                    {a.reason}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ManageAppointments;
