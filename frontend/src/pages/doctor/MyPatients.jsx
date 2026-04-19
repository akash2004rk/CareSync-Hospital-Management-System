import { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import toast from 'react-hot-toast';
import { LuUsers, LuPhone, LuDroplets, LuEye } from 'react-icons/lu';

function MyPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/appointments')
      .then(res => {
        const appts = Array.isArray(res.data) ? res.data : (res.data.appointments || []);
        const unique = [];
        const seen = new Set();
        appts.forEach(a => {
          if (a.patientId && !seen.has(a.patientId._id)) {
            seen.add(a.patientId._id);
            unique.push(a.patientId);
          }
        });
        setPatients(unique);
      })
      .catch(() => toast.error('Failed to load patients'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = patients.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loader-wrapper"><div className="spinner" /></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Patients</h1>
          <p className="page-subtitle">Directory of patients you have treated or have upcoming sessions with</p>
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ minWidth: 260 }}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state card">
          <LuUsers size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
          <h3>No patients found</h3>
          <p>Your patients will appear here once you have appointments</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {filtered.map(p => (
            <div key={p._id} className="card" style={{ display: 'flex', gap: 16 }}>
              <div className="avatar avatar-lg" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', flexShrink: 0 }}>
                {p.name?.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.name}
                </h3>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>{p.email}</div>

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <div style={{ fontSize: 12, background: 'var(--bg-secondary)', padding: '4px 8px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <LuPhone size={12} style={{ color: 'var(--text-muted)' }}/> {p.phone || 'No phone'}
                  </div>
                  <div style={{ fontSize: 12, background: 'var(--bg-secondary)', padding: '4px 8px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <LuDroplets size={12} style={{ color: 'var(--danger)' }}/> {p.bloodGroup || 'O+'}
                  </div>
                </div>

                <div style={{ marginTop: 16, borderTop: '1px solid var(--border-light)', paddingTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => toast.success('Patient history feature coming soon!')}>
                    <LuEye size={14}/> View History
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyPatients;
