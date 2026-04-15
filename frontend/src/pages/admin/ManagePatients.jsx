import { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import toast from 'react-hot-toast';

function ManagePatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/auth/patients')
      .then(r => setPatients(r.data))
      .catch(() => toast.error('Failed to load patients'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loader-wrapper"><div className="spinner" /></div>;

  return (
    <div className="page-container" style={{ animation: 'fadeIn 0.3s ease' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Patients</h1>
          <p className="page-subtitle">{patients.length} registered patients</p>
        </div>
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            id="patient-search"
            className="form-input search-input"
            placeholder="Search patients..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 240 }}
          />
        </div>
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🧑‍🤝‍🧑</div>
            <h3>No patients found</h3>
            <p>{search ? 'Try a different search term' : 'Patients will appear here after registration'}</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Phone</th>
                  <th>Total Appointments</th>
                  <th>Last Visit</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p._id}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div className="avatar" style={{ background:'linear-gradient(135deg,#f59e0b,#ef4444)' }}>
                          {p.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <div style={{ fontWeight:600, color:'var(--text-primary)' }}>{p.name}</div>
                          <div style={{ fontSize:12, color:'var(--text-muted)' }}>{p.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{p.phone || <span style={{ color:'var(--text-muted)' }}>—</span>}</td>
                    <td>
                      <span className="badge badge-info">{p.totalAppts}</span>
                    </td>
                    <td>
                      {p.lastVisit !== 'N/A' ? new Date(p.lastVisit).toLocaleDateString('en-IN') : <span style={{ color:'var(--text-muted)' }}>Never</span>}
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

export default ManagePatients;
