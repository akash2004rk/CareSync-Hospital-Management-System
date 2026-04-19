import { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import toast from 'react-hot-toast';

function DoctorSlots() {
  const [slots, setSlots] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Bulk Generator State
  const [showGenerator, setShowGenerator] = useState(false);
  const [genData, setGenData] = useState({ date: '', start: '09:00', end: '17:00', interval: 30 });

  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, apptsRes] = await Promise.all([
          api.get('/doctors/profile'),
          api.get('/appointments')
        ]);
        if (profileRes.data?.availableSlots) {
          const sorted = [...profileRes.data.availableSlots].sort((a, b) => 
            a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime)
          );
          setSlots(sorted);
        }
        setAppointments(Array.isArray(apptsRes.data) ? apptsRes.data : (apptsRes.data.appointments || []));
      } catch {
        toast.error('Failed to load slots/appointments');
      } finally { setLoading(false); }
    };
    load();
  }, []);

  const today = new Date().toISOString().split('T')[0];

  const addSlot = (customDate = '') => {
    const newSlot = { date: customDate || today, startTime: '09:00', endTime: '10:00', isBooked: false };
    setSlots(s => [...s, newSlot]);
  };

  const removeSlot = (i) => {
    if (slots[i].isBooked) return toast.error('Cannot remove a booked slot!');
    setSlots(s => s.filter((_, idx) => idx !== i));
  };

  const updateSlot = (i, field, val) => setSlots(s => s.map((sl, idx) => idx === i ? { ...sl, [field]: val } : sl));

  const handleSave = async () => {
    if (slots.some(s => !s.date || !s.startTime || !s.endTime)) return toast.error('Please fill all slot fields');
    const sortedSlots = [...slots].sort((a,b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));
    setSaving(true);
    try {
      await api.put('/doctors/slots', { slots: sortedSlots });
      setSlots(sortedSlots);
      toast.success('Availability slots saved!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save slots');
    } finally { setSaving(false); }
  };

  // --- TIME SAVER TOOLS ---

  const handleBulkGenerate = () => {
    const { date, start, end, interval } = genData;
    if (!date || !start || !end) return toast.error('Fill generator fields');

    const newSlots = [];
    let current = new Date(`${date}T${start}`);
    const stopAt = new Date(`${date}T${end}`);

    if (stopAt <= current) return toast.error('End time must be after start time');

    while (current < stopAt) {
      const startStr = current.toTimeString().slice(0, 5);
      current.setMinutes(current.getMinutes() + parseInt(interval));
      const endStr = current.toTimeString().slice(0, 5);
      
      if (current <= stopAt) {
        newSlots.push({ date, startTime: startStr, endTime: endStr, isBooked: false });
      }
    }

    setSlots(s => [...s, ...newSlots]);
    setShowGenerator(false);
    toast.success(`Generated ${newSlots.length} slots for ${date}`);
  };

  const copyDaySchedule = (sourceDate) => {
    const daySlots = slots.filter(s => s.date === sourceDate);
    if (daySlots.length === 0) return toast.error('No slots to copy');

    const nextDay = new Date(sourceDate);
    nextDay.setDate(nextDay.getDate() + 1);
    const nextDayStr = nextDay.toISOString().split('T')[0];

    // Only copy unbooked ones
    const newSlots = daySlots.map(s => ({ ...s, date: nextDayStr, isBooked: false }));
    setSlots(s => [...s, ...newSlots]);
    toast.success(`Copied ${newSlots.length} slots to ${nextDayStr}`);
  };

  const clearAvailable = () => {
    if (!window.confirm('Wipe all available slots? Booked ones will be kept.')) return;
    setSlots(s => s.filter(x => x.isBooked));
    toast.success('Cleared all available slots');
  };

  // --- RENDERING ---

  const bookedCount = slots.filter(s => s.isBooked).length;
  const availableCount = slots.length - bookedCount;

  const groupedSlots = slots.reduce((acc, slot, originalIndex) => {
    const date = slot.date || 'No Date';
    if (!acc[date]) acc[date] = [];
    acc[date].push({ ...slot, originalIndex });
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedSlots).sort();

  if (loading) return <div className="loader-wrapper"><div className="spinner" /></div>;

  return (
    <div className="page-container" >
      <div className="page-header">
        <div>
          <h1 className="page-title">My Availability Slots</h1>
          <p className="page-subtitle">Manage your schedule with high-efficiency tools</p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button className="btn btn-ghost" onClick={clearAvailable}>🧹 Clear Unbooked</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? '⏳ Saving...' : '💾 Save Changes'}
          </button>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Slots', value: slots.length, icon: '📊', color: 'blue' },
          { label: 'Booked',     value: bookedCount, icon: '✅', color: 'green' },
          { label: 'Available',  value: availableCount, icon: '📅', color: 'purple' },
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

      {/* QUICK ACTIONS BAR */}
      <div className="card" style={{ marginBottom: 24, padding: '16px 24px', display:'flex', gap:16, alignItems:'center', flexWrap:'wrap' }}>
        <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-secondary)' }}>⚡ Time-Saver:</span>
        <button className="btn btn-sm" style={{ background:'var(--bg-secondary)' }} onClick={() => addSlot(today)}>+ Today Slot</button>
        <button className="btn btn-sm btn-primary" onClick={() => { setGenData({ ...genData, date: today }); setShowGenerator(true); }}>✨ Bulk Shift Generator</button>
      </div>

      {showGenerator && (
        <div className="modal-overlay" onClick={() => setShowGenerator(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
             <div className="modal-header">
               <h2 className="modal-title">✨ Bulk Shift Generator</h2>
               <button className="btn-close" onClick={() => setShowGenerator(false)}>✕</button>
             </div>
             <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input type="date" className="form-input" min={today} value={genData.date} onChange={e => setGenData({...genData, date: e.target.value})} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Start Shift</label>
                    <input type="time" className="form-input" value={genData.start} onChange={e => setGenData({...genData, start: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Shift</label>
                    <input type="time" className="form-input" value={genData.end} onChange={e => setGenData({...genData, end: e.target.value})} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Slot Duration (Minutes)</label>
                  <select className="form-input" value={genData.interval} onChange={e => setGenData({...genData, interval: e.target.value})}>
                    <option value={15}>15 Minutes</option>
                    <option value={30}>30 Minutes</option>
                    <option value={45}>45 Minutes</option>
                    <option value={60}>60 Minutes (1 Hour)</option>
                  </select>
                </div>
                <button className="btn btn-primary btn-full" onClick={handleBulkGenerate}>Generate Shift Slots</button>
             </div>
          </div>
        </div>
      )}

      {slots.length === 0 ? (
        <div className="card"><div className="empty-state"><h3>No slots added</h3><p>Click "New Slot" or use the Generator</p></div></div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
          {sortedDates.map(date => (
            <div key={date}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12, paddingBottom:8, borderBottom:'1px solid var(--border-light)' }}>
                <h2 style={{ fontSize:15, fontWeight:600, display:'flex', alignItems:'center', gap:8 }}>
                   📅 {date === today ? 'Today' : new Date(date).toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short' })}
                   <span style={{ fontSize:12, opacity:0.6 }}>({groupedSlots[date].length} slots)</span>
                </h2>
                <button className="btn btn-sm btn-ghost" style={{ fontSize:11, padding:'4px 10px' }} onClick={() => copyDaySchedule(date)}>📋 Copy to Tomorrow</button>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {groupedSlots[date].map((slot) => (
                  <div key={slot.originalIndex} className="card card-sm hover-card" style={{ borderLeft: `3px solid ${slot.isBooked ? 'var(--success)' : 'var(--accent)'}`, minHeight: 64 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
                      <span style={{ fontSize:10, fontWeight:700, color: slot.isBooked ? 'var(--success)' : 'var(--accent)', textTransform:'uppercase', minWidth:60 }}>
                        {slot.isBooked ? 'Booked' : 'Available'}
                      </span>
                      <div className="form-group"><input type="time" className="form-input btn-sm" value={slot.startTime} disabled={slot.isBooked} onChange={e => updateSlot(slot.originalIndex, 'startTime', e.target.value)} /></div>
                      <div className="form-group"><input type="time" className="form-input btn-sm" value={slot.endTime} disabled={slot.isBooked} onChange={e => updateSlot(slot.originalIndex, 'endTime', e.target.value)} /></div>

                      {slot.isBooked ? (
                        <div style={{ flex:1, display:'flex', alignItems:'center', gap:10, background:'var(--bg-secondary)', padding:'4px 12px', borderRadius:8, border:'1px solid var(--border)' }}>
                          <div className="avatar" style={{ width:24, height:24, fontSize:10 }}>{appointments.find(x => x.date === slot.date && x.timeSlot === slot.startTime)?.patientId?.name?.charAt(0)}</div>
                          {(() => {
                             const a = appointments.find(x => x.date === slot.date && x.timeSlot === slot.startTime);
                             return a ? <div style={{ fontSize:11 }}><b>{a.patientId?.name}</b> <span style={{ opacity:0.6, marginLeft:8 }}>📞 {a.patientId?.phone}</span></div> : null;
                          })()}
                        </div>
                      ) : (
                        <button className="btn-icon" onClick={() => removeSlot(slot.originalIndex)} style={{ border:'none', color:'var(--danger)', marginLeft:'auto' }}>🗑️</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`.hover-card:hover { transform: translateX(2px); }`}</style>
    </div>
  );
}

export default DoctorSlots;
