import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../../api/axios.js';
import toast from 'react-hot-toast';

const SPECIALIZATIONS = ['General Physician','Cardiologist','Dermatologist','Neurologist','Orthopedic','Pediatrician','Psychiatrist','Surgeon','Gynecologist','ENT Specialist','Ophthalmologist','Radiologist'];

function DoctorProfile() {
  const { user } = useSelector(s => s.auth);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    api.get(`/doctors/${user._id}`)
      .then(r => {
        setProfile(r.data);
        setForm({
          specialization: r.data.specialization,
          consultationFee: r.data.consultationFee,
          experience: r.data.experience,
        });
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    try {
      const { data } = await api.put(`/doctors/profile/${profile._id}`, form);
      setProfile(data);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="loader-wrapper"><div className="spinner" /></div>;

  return (
    <div className="page-container" style={{ animation: 'fadeIn 0.3s ease' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Manage your professional information</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }} className="profile-grid">
        {/* Identity card */}
        <div className="card" style={{ textAlign: 'center', height: 'fit-content' }}>
          <div className="avatar avatar-xl" style={{
            margin: '0 auto 16px',
            background: 'linear-gradient(135deg,#10b981,#06b6d4)',
            fontSize: 36,
          }}>
            {user?.name?.charAt(0) || '?'}
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{user?.name}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 12 }}>{user?.email}</p>
          <span className={`badge ${profile?.isVerified ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: 13 }}>
            {profile?.isVerified ? '✅ Verified Doctor' : '⏳ Pending Verification'}
          </span>
          <div className="divider" />
          <div style={{ display:'flex', justifyContent:'space-around', fontSize: 13, color:'var(--text-muted)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize:22, fontWeight:700, color:'var(--text-primary)' }}>{profile?.experience}</div>
              <div>Yrs Exp.</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize:22, fontWeight:700, color:'var(--text-primary)' }}>⭐{profile?.rating?.toFixed(1)}</div>
              <div>Rating</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize:22, fontWeight:700, color:'var(--text-primary)' }}>₹{profile?.consultationFee}</div>
              <div>Fee</div>
            </div>
          </div>
        </div>

        {/* Edit form */}
        <div className="card">
          <h2 className="section-title">Edit Professional Details</h2>
          {!profile ? (
            <div className="alert alert-warning">No doctor profile found. Please contact admin.</div>
          ) : (
            <form onSubmit={handleSave} style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div className="form-group">
                <label className="form-label">Specialization</label>
                <select className="form-input" value={form.specialization || ''}
                  onChange={e => setForm(f => ({...f, specialization: e.target.value}))}>
                  {SPECIALIZATIONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Experience (years)</label>
                  <input type="number" min={0} className="form-input" value={form.experience ?? ''}
                    onChange={e => setForm(f => ({...f, experience: +e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Consultation Fee (₹)</label>
                  <input type="number" min={0} className="form-input" value={form.consultationFee ?? ''}
                    onChange={e => setForm(f => ({...f, consultationFee: +e.target.value}))} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving} style={{ width:'fit-content' }}>
                {saving ? '⏳ Saving...' : '💾 Save Changes'}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .profile-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export default DoctorProfile;
