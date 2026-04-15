import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios.js';
import toast from 'react-hot-toast';

function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [selected, setSelected] = useState(null);
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({ doctorId:'', date:'', timeSlot:'', reason:'' });
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/doctors')
      .then(r => setDoctors(r.data))
      .catch(() => toast.error('Failed to load doctors'))
      .finally(() => setLoading(false));
  }, []);

  const selectDoctor = (d) => {
    setSelected(d);
    setForm(f => ({ ...f, doctorId: d.userId._id, timeSlot: '' }));
  };

  useEffect(() => {
    if (!selected) {
      setSlots([]);
      return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    let allSlots = (selected.availableSlots || []).filter(s => s.date >= today);
    
    if (form.date) {
      allSlots = allSlots.filter(s => s.date === form.date);
    }

    // Sort by date and then by time
    allSlots.sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));
    
    setSlots(allSlots);
  }, [selected, form.date]);

  const handleDateChange = (date) => {
    setForm(f => ({ ...f, date, timeSlot: '' }));
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!form.doctorId || !form.date || !form.timeSlot || !form.reason) {
      toast.error('Please fill all required fields'); return;
    }
    setBooking(true);
    try {
      await api.post('/appointments', form);
      toast.success('Appointment booked successfully!');
      navigate('/patient');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to book appointment');
    } finally { setBooking(false); }
  };

  const filtered = doctors.filter(d =>
    d.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loader-wrapper"><div className="spinner" /></div>;

  return (
    <div className="page-container" style={{ animation: 'fadeIn 0.3s ease' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Book Appointment</h1>
          <p className="page-subtitle">Choose a verified doctor and available slot</p>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }} className="book-grid">
        {/* Doctor list */}
        <div>
          <div className="search-wrapper" style={{ marginBottom:14, width:'100%' }}>
            <span className="search-icon">🔍</span>
            <input className="form-input search-input" placeholder="Search by name or specialization..."
              value={search} onChange={e => setSearch(e.target.value)} style={{ width:'100%' }} />
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10, maxHeight:520, overflowY:'auto', paddingRight:4 }}>
            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">👨‍⚕️</div>
                <h3>No doctors found</h3>
              </div>
            ) : filtered.map(d => (
              <div
                key={d._id}
                onClick={() => selectDoctor(d)}
                className="card card-sm"
                style={{
                  cursor:'pointer',
                  borderColor: selected?._id === d._id ? 'var(--accent)' : 'var(--border-light)',
                  background: selected?._id === d._id ? 'var(--accent-light)' : 'var(--bg-card)',
                  transition:'all 0.15s',
                }}
              >
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div className="avatar" style={{ background:'linear-gradient(135deg,#10b981,#06b6d4)', width:44, height:44, fontSize:18, flexShrink:0 }}>
                    {d.userId?.name?.charAt(0)}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:600, color:'var(--text-primary)' }}>{d.userId?.name}</div>
                    <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:4 }}>{d.specialization}</div>
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                      <span className="badge badge-info" style={{ fontSize:11 }}>⭐ {d.rating?.toFixed(1)}</span>
                      <span className="badge badge-success" style={{ fontSize:11 }}>₹{d.consultationFee}</span>
                      <span className="badge badge-purple" style={{ fontSize:11 }}>{d.experience} yrs</span>
                    </div>
                  </div>
                  {selected?._id === d._id && <span style={{ color:'var(--accent)', fontSize:18 }}>✓</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking form */}
        <div className="card" style={{ height:'fit-content' }}>
          <h2 className="section-title">
            {selected ? `Book with ${selected.userId?.name}` : 'Select a doctor'}
          </h2>
          {!selected ? (
            <div className="empty-state" style={{ padding:'32px 20px' }}>
              <div className="empty-state-icon">👈</div>
              <h3>No doctor selected</h3>
              <p>Click on a doctor from the list to book</p>
            </div>
          ) : (
            <form onSubmit={handleBook} style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div className="form-group">
                <label className="form-label">Select Date</label>
                <input type="date" className="form-input" min={new Date().toISOString().split('T')[0]}
                  value={form.date} onChange={e => handleDateChange(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Available Time Slots</label>
                {slots.length === 0 ? (
                  <p style={{ fontSize:13, color:'var(--text-muted)', padding:'10px 0' }}>
                    {form.date ? 'No slots available for this date' : 'No available slots for this doctor'}
                  </p>
                ) : (
                  <div style={{ display:'flex', flexDirection:'column', gap:12, maxHeight:200, overflowY:'auto', paddingRight:4 }}>
                    {/* Unique dates in the current slots */}
                    {[...new Set(slots.map(s => s.date))].map(date => (
                      <div key={date}>
                        <div style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', marginBottom:4, textTransform:'uppercase' }}>
                          {new Date(date).toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short' })}
                        </div>
                        <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                          {slots.filter(s => s.date === date).map((s, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => !s.isBooked && setForm(f => ({ ...f, date: s.date, timeSlot: s.startTime }))}
                              className="btn btn-sm"
                              disabled={s.isBooked}
                              style={{
                                background: s.isBooked ? 'var(--bg-secondary-dark)' : (form.timeSlot === s.startTime && form.date === s.date) ? 'var(--accent)' : 'var(--bg-secondary)',
                                color: s.isBooked ? 'var(--text-muted)' : (form.timeSlot === s.startTime && form.date === s.date) ? 'white' : 'var(--text-secondary)',
                                border: `1px solid ${s.isBooked ? 'var(--border-light)' : (form.timeSlot === s.startTime && form.date === s.date) ? 'var(--accent)' : 'var(--border)'}`,
                                fontSize: 11,
                                padding: '4px 8px',
                                textDecoration: s.isBooked ? 'line-through' : 'none',
                                cursor: s.isBooked ? 'not-allowed' : 'pointer',
                                opacity: s.isBooked ? 0.6 : 1
                              }}
                            >
                              {s.startTime} {s.isBooked && '(Taken)'}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Reason for Visit</label>
                <textarea className="form-input" placeholder="Describe your symptoms or reason..."
                  value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                  required rows={3} />
              </div>

              <button type="submit" className="btn btn-primary btn-full" disabled={booking}>
                {booking ? '⏳ Booking...' : '📅 Confirm Appointment'}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .book-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export default BookAppointment;
