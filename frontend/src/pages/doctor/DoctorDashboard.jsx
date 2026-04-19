import { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import toast from 'react-hot-toast';
import { LuStethoscope, LuUsers, LuCalendarDays, LuCircleCheck, LuX, LuPaperclip, LuEye } from 'react-icons/lu';

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientRecords, setPatientRecords] = useState([]);
  const [viewingRecords, setViewingRecords] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeAppointment, setActiveAppointment] = useState(null);
  const fileRef = { current: null };

  useEffect(() => {
    api.get('/appointments')
      .then(r => setAppointments(Array.isArray(r.data) ? r.data : (r.data.appointments || [])))
      .catch(() => toast.error('Failed to load appointments'))
      .finally(() => setLoading(false));
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}`, { status });
      setAppointments(a => a.map(x => x._id === id ? { ...x, status } : x));
      toast.success(`Appointment ${status}`);
    } catch { toast.error('Failed to update status'); }
  };

  const handleUploadClick = (appt) => {
    setActiveAppointment(appt);
    fileRef.current?.click();
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !activeAppointment) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('patientId', activeAppointment.patientId._id);
    formData.append('appointmentId', activeAppointment._id);
    formData.append('recordType', 'Doctor Note');
    setUploading(true);
    try {
      await api.post('/medical-records', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Record uploaded successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      setActiveAppointment(null);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const fetchPatientRecords = async (patient) => {
    setSelectedPatient(patient);
    setViewingRecords(true);
    try {
      const { data } = await api.get(`/medical-records?patientId=${patient._id}`);
      setPatientRecords(data);
    } catch {
      toast.error('Failed to load patient records');
    }
  };

  const statusBadge = (s) => {
    const map = { pending:'badge-warning', confirmed:'badge-info', completed:'badge-success', cancelled:'badge-danger' };
    return <span className={`badge ${map[s] || 'badge-info'}`}>{s}</span>;
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter(a => a.date === todayStr);
  const pending = appointments.filter(a => a.status === 'pending');
  const completed = appointments.filter(a => a.status === 'completed');

  if (loading) return <div className="loader-wrapper"><div className="spinner" /></div>;

  return (
    <div className="page-container" >
      <div className="page-header">
        <div>
          <h1 className="page-title">Doctor Dashboard</h1>
          <p className="page-subtitle">Your appointment overview for today</p>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          {new Date().toLocaleDateString('en-IN', { weekday:'long', month:'long', day:'numeric' })}
        </div>
        <input
          type="file"
          ref={fileRef}
          style={{ display: 'none' }}
          onChange={handleUpload}
          accept=".pdf,.jpg,.jpeg,.png"
        />
      </div>

      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {[
          { label: "Today's Appointments", value: todayAppts.length,  icon: <LuCalendarDays size={22}/>, color: 'blue'   },
          { label: 'Pending',              value: pending.length,     icon: <LuStethoscope size={22}/>,  color: 'yellow' },
          { label: 'Completed',            value: completed.length,   icon: <LuCircleCheck size={22}/>, color: 'green'  },
          { label: 'Total All-time',       value: appointments.length,icon: <LuUsers size={22}/>,        color: 'purple' },
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

      <div className="card">
        <h2 className="section-title">All Appointments</h2>
        {appointments.length === 0 ? (
          <div className="empty-state">
            <LuCalendarDays size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
            <h3>No appointments yet</h3>
            <p>Appointments from patients will appear here</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="table-wrapper hide-mobile">
              <table>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(a => (
                    <tr key={a._id}>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <div className="avatar" style={{ background:'linear-gradient(135deg,#f59e0b,#ef4444)', width:28, height:28, fontSize:12 }}>
                            {a.patientId?.name?.charAt(0) || '?'}
                          </div>
                          <span style={{ fontWeight:500, color:'var(--text-primary)' }}>{a.patientId?.name || 'N/A'}</span>
                        </div>
                      </td>
                      <td>{a.date}</td>
                      <td>{a.timeSlot}</td>
                      <td style={{ maxWidth:140, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.reason}</td>
                      <td>{statusBadge(a.status)}</td>
                      <td>
                        <div style={{ display:'flex', gap:6 }}>
                          {a.status === 'pending' && (
                            <>
                              <button className="btn btn-success btn-sm" title="Confirm" onClick={() => handleStatus(a._id, 'confirmed')}><LuCircleCheck size={14}/></button>
                              <button className="btn btn-danger btn-sm" title="Cancel" onClick={() => handleStatus(a._id, 'cancelled')}><LuX size={14}/></button>
                            </>
                          )}
                          {a.status === 'confirmed' && (
                            <button className="btn btn-primary btn-sm" onClick={() => handleStatus(a._id, 'completed')}>Done</button>
                          )}
                          <button
                            className="btn btn-ghost btn-sm"
                            title="Upload Record"
                            onClick={() => handleUploadClick(a)}
                            disabled={uploading}
                          >
                            <LuPaperclip size={14}/>
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            title="View History"
                            onClick={() => fetchPatientRecords(a.patientId)}
                          >
                            <LuEye size={14}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="mobile-card-list show-mobile-only">
              {appointments.map(a => (
                <div key={a._id} className="mobile-card">
                  <div className="mobile-card-header">
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div className="avatar" style={{ background:'linear-gradient(135deg,#f59e0b,#ef4444)', width:28, height:28, fontSize:12 }}>
                        {a.patientId?.name?.charAt(0) || '?'}
                      </div>
                      <span style={{ fontWeight:600, color:'var(--text-primary)' }}>{a.patientId?.name || 'N/A'}</span>
                    </div>
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
                  <div className="mobile-card-footer">
                    {a.status === 'pending' && (
                      <>
                        <button className="btn btn-success btn-sm" onClick={() => handleStatus(a._id, 'confirmed')}><LuCircleCheck size={14}/> Confirm</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleStatus(a._id, 'cancelled')}><LuX size={14}/> Cancel</button>
                      </>
                    )}
                    {a.status === 'confirmed' && (
                      <button className="btn btn-primary btn-sm" onClick={() => handleStatus(a._id, 'completed')}>Complete</button>
                    )}
                    <button className="btn btn-ghost btn-sm" onClick={() => handleUploadClick(a)} disabled={uploading}>
                      <LuPaperclip size={14}/> Upload
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => fetchPatientRecords(a.patientId)}>
                      <LuEye size={14}/> View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {viewingRecords && (
        <div className="modal-overlay" onClick={() => setViewingRecords(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 800, width: '90%' }}>
            <div className="modal-header">
              <h2 className="modal-title">Medical History: {selectedPatient?.name}</h2>
              <button className="btn-icon" onClick={() => setViewingRecords(false)}><LuX size={18}/></button>
            </div>
            <div className="modal-body">
              {patientRecords.length === 0 ? (
                <p style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)' }}>No medical records found for this patient.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
                  {patientRecords.map(r => (
                    <div key={r._id} className="card card-sm">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--accent)' }}>
                          <LuPaperclip size={18}/>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {r.fileUrl?.split('\\').pop() || 'Record'}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                            {new Date(r.createdAt).toLocaleDateString('en-IN')}
                          </div>
                        </div>
                      </div>
                      <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="badge badge-info" style={{ fontSize: 10 }}>{r.recordType}</span>
                        <a href={`http://localhost:5000/${r.fileUrl}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ height: 24, fontSize: 11 }}>View</a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorDashboard;
