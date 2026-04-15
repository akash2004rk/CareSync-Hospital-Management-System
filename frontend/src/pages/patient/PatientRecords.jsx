import { useEffect, useState, useRef } from 'react';
import api from '../../api/axios.js';
import toast from 'react-hot-toast';

function PatientRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const fileRef = useRef();

  const load = () => {
    api.get('/medical-records')
      .then(r => setRecords(r.data))
      .catch(() => toast.error('Failed to load records'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);


  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await api.delete(`/medical-records/${id}`);
      toast.success('Record deleted');
      setRecords(r => r.filter(x => x._id !== id));
    } catch { toast.error('Failed to delete record'); }
  };

  if (loading) return <div className="loader-wrapper"><div className="spinner" /></div>;

  return (
    <div className="page-container" style={{ animation: 'fadeIn 0.3s ease' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Medical Records</h1>
          <p className="page-subtitle">{records.length} records stored securely</p>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>No medical records</h3>
            <p>Upload prescriptions, lab reports, or scan files to keep them safe</p>
          </div>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px,1fr))', gap:16 }}>
          {records.map(r => (
            <div key={r._id} className="card card-sm" style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{
                  width:44, height:44, borderRadius:8, background:'var(--accent-light)',
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0,
                }}>
                  {r.fileUrl?.endsWith('.pdf') ? '📄' : '🖼️'}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:600, color:'var(--text-primary)', fontSize:14, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {r.fileUrl?.split('\\').pop() || 'Record'}
                  </div>
                  <div style={{ fontSize:12, color:'var(--text-muted)' }}>
                    {new Date(r.createdAt).toLocaleDateString('en-IN')}
                  </div>
                </div>
              </div>

              <div style={{ display:'flex', gap:6 }}>
                <span className={`badge ${r.uploadedBy === 'doctor' ? 'badge-info' : 'badge-purple'}`} style={{ fontSize:11 }}>
                  {r.uploadedBy === 'doctor' ? '👨‍⚕️ Doctor' : '👤 Self'}
                </span>
                <span className="badge badge-success" style={{ fontSize:11 }}>{r.recordType}</span>
              </div>

              <div style={{ display:'flex', gap:8, marginTop:4 }}>
                <a
                  href={`http://localhost:5000/${r.fileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost btn-sm"
                  style={{ flex:1, justifyContent:'center' }}
                >
                  👁️ View
                </a>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(r._id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PatientRecords;
