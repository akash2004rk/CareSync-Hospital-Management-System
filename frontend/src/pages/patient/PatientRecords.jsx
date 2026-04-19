import { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import toast from 'react-hot-toast';
import { LuFileText, LuImage, LuTrash2, LuEye, LuFolderOpen } from 'react-icons/lu';

function PatientRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="page-container" >
      <div className="page-header">
        <div>
          <h1 className="page-title">Medical Records</h1>
          <p className="page-subtitle">{records.length} records stored securely</p>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <LuFolderOpen size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
            <h3>No medical records</h3>
            <p>Your doctor will upload prescriptions and lab reports here after consultations</p>
          </div>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px,1fr))', gap:16 }}>
          {records.map(r => (
            <div key={r._id} className="card card-sm" style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{
                  width:44, height:44, borderRadius:8, background:'var(--accent-light)',
                  display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color: 'var(--accent)'
                }}>
                  {r.fileUrl?.endsWith('.pdf') ? <LuFileText size={22}/> : <LuImage size={22}/>}
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
                  {r.uploadedBy === 'doctor' ? 'Doctor Upload' : 'Self Upload'}
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
                  <LuEye size={14}/> View
                </a>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(r._id)}
                >
                  <LuTrash2 size={14}/>
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
