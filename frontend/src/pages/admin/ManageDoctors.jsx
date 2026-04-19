import { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import toast from 'react-hot-toast';
import { LuStethoscope, LuShieldCheck, LuShieldOff, LuTrash2, LuX } from 'react-icons/lu';

const SPECIALIZATIONS = ['General Physician','Cardiologist','Dermatologist','Neurologist','Orthopedic','Pediatrician','Psychiatrist','Surgeon','Gynecologist','ENT Specialist','Ophthalmologist','Radiologist'];
const EMPTY_FORM = { name:'', email:'', password:'', specialization:'General Physician', consultationFee:500, experience:0 };

function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get('/doctors/admin/all');
      setDoctors(data);
    } catch { toast.error('Failed to load doctors'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/doctors/admin/add', form);
      toast.success('Doctor added successfully!');
      setShowModal(false);
      setForm(EMPTY_FORM);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add doctor');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this doctor? This cannot be undone.')) return;
    try {
      await api.delete(`/doctors/admin/${id}`);
      toast.success('Doctor deleted');
      setDoctors(d => d.filter(x => x._id !== id));
    } catch { toast.error('Failed to delete doctor'); }
  };

  const handleVerify = async (id, current) => {
    try {
      await api.put(`/doctors/admin/${id}/verify`, { isVerified: !current });
      toast.success(`Doctor ${!current ? 'verified' : 'unverified'}`);
      setDoctors(d => d.map(x => x._id === id ? { ...x, isVerified: !current } : x));
    } catch { toast.error('Failed to update verification'); }
  };

  if (loading) return <div className="loader-wrapper"><div className="spinner" /></div>;

  return (
    <div className="page-container" >
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Doctors</h1>
          <p className="page-subtitle">{doctors.length} total doctors registered</p>
        </div>
        <button id="add-doctor-btn" className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Add Doctor
        </button>
      </div>

      <div className="card">
        {doctors.length === 0 ? (
          <div className="empty-state">
            <LuStethoscope size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
            <h3>No doctors found</h3>
            <p>Add doctors using the button above</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="table-wrapper hide-mobile">
              <table>
                <thead>
                  <tr>
                    <th>Doctor</th>
                    <th>Specialization</th>
                    <th>Experience</th>
                    <th>Fee</th>
                    <th>Rating</th>
                    <th>Verification</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map(d => (
                    <tr key={d._id}>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <div className="avatar" style={{ background:'linear-gradient(135deg,#10b981,#06b6d4)' }}>
                            {d.userId?.name?.charAt(0) || '?'}
                          </div>
                          <div>
                            <div style={{ fontWeight:600, color:'var(--text-primary)' }}>{d.userId?.name || 'N/A'}</div>
                            <div style={{ fontSize:12, color:'var(--text-muted)' }}>{d.userId?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge badge-info">{d.specialization}</span></td>
                      <td>{d.experience} yrs</td>
                      <td>₹{d.consultationFee}</td>
                      <td>★ {d.rating?.toFixed(1) ?? '—'}</td>
                      <td>
                        <span className={`badge ${d.isVerified ? 'badge-success' : 'badge-warning'}`}>
                          {d.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display:'flex', gap:6 }}>
                          <button
                            className={`btn btn-sm ${d.isVerified ? 'btn-ghost' : 'btn-success'}`}
                            onClick={() => handleVerify(d._id, d.isVerified)}
                            title={d.isVerified ? 'Click to unverify' : 'Click to verify'}
                          >
                            {d.isVerified ? <LuShieldOff size={14}/> : <LuShieldCheck size={14}/>}
                            {d.isVerified ? ' Unverify' : ' Verify'}
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(d._id)}
                            title="Delete doctor"
                          >
                            <LuTrash2 size={14}/>
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
              {doctors.map(d => (
                <div key={d._id} className="mobile-card">
                  <div className="mobile-card-header">
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div className="avatar" style={{ background:'linear-gradient(135deg,#10b981,#06b6d4)', width:32, height:32 }}>
                        {d.userId?.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <div style={{ fontWeight:600, color:'var(--text-primary)', fontSize:14 }}>{d.userId?.name || 'N/A'}</div>
                        <div style={{ fontSize:11, color:'var(--text-muted)' }}>{d.userId?.email}</div>
                      </div>
                    </div>
                    <span className={`badge ${d.isVerified ? 'badge-success' : 'badge-warning'}`} style={{ fontSize:10 }}>
                      {d.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                  <div className="mobile-card-body">
                    <div className="mobile-card-item">
                      <span className="mobile-card-label">Specialization</span>
                      <span className="mobile-card-value">{d.specialization}</span>
                    </div>
                    <div className="mobile-card-item">
                      <span className="mobile-card-label">Experience</span>
                      <span className="mobile-card-value">{d.experience} yrs</span>
                    </div>
                    <div className="mobile-card-item">
                      <span className="mobile-card-label">Consultation Fee</span>
                      <span className="mobile-card-value">₹{d.consultationFee}</span>
                    </div>
                    <div className="mobile-card-item">
                      <span className="mobile-card-label">Rating</span>
                      <span className="mobile-card-value">★ {d.rating?.toFixed(1) ?? '—'}</span>
                    </div>
                  </div>
                  <div className="mobile-card-footer">
                    <button
                      className={`btn btn-sm ${d.isVerified ? 'btn-ghost' : 'btn-success'}`}
                      onClick={() => handleVerify(d._id, d.isVerified)}
                    >
                      {d.isVerified ? <LuShieldOff size={14}/> : <LuShieldCheck size={14}/>}
                      {d.isVerified ? ' Unverify' : ' Verify'}
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(d._id)}>
                      <LuTrash2 size={14}/> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Add Doctor Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add New Doctor</h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}><LuX size={18}/></button>
            </div>
            <form onSubmit={handleAdd} style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" placeholder="Dr. Jane Smith" value={form.name}
                  onChange={e => setForm(f => ({...f, name: e.target.value}))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" placeholder="doctor@hospital.com" value={form.email}
                  onChange={e => setForm(f => ({...f, email: e.target.value}))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" className="form-input" placeholder="Min 6 characters" value={form.password}
                  onChange={e => setForm(f => ({...f, password: e.target.value}))} required minLength={6} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Specialization</label>
                  <select className="form-input" value={form.specialization}
                    onChange={e => setForm(f => ({...f, specialization: e.target.value}))}>
                    {SPECIALIZATIONS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Experience (yrs)</label>
                  <input type="number" min={0} className="form-input" value={form.experience}
                    onChange={e => setForm(f => ({...f, experience: +e.target.value}))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Consultation Fee (₹)</label>
                <input type="number" min={0} className="form-input" value={form.consultationFee}
                  onChange={e => setForm(f => ({...f, consultationFee: +e.target.value}))} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Adding...' : 'Add Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageDoctors;
