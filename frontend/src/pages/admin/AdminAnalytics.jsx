import { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import toast from 'react-hot-toast';

function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [statusDist, setStatusDist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics/admin')
      .then(r => {
        // Backend: { stats: { totalDoctors, totalPatients, todayAppointments, revenue },
        //           statusDistribution: [{name, value},...], chartData: [...] }
        setStats(r.data.stats || {});
        setStatusDist(r.data.statusDistribution || []);
      })
      .catch(() => toast.error('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loader-wrapper"><div className="spinner" /></div>;

  // Derive totals from statusDistribution
  const totalAppts = statusDist.reduce((sum, s) => sum + s.value, 0);
  const getCount = (name) => statusDist.find(s => s.name === name)?.value ?? 0;

  const cards = [
    { label: 'Total Doctors',     value: stats?.totalDoctors      ?? 0, icon: '👨‍⚕️', color: 'blue'   },
    { label: 'Total Patients',    value: stats?.totalPatients     ?? 0, icon: '🧑‍🤝‍🧑', color: 'green'  },
    { label: "Today's Appointments", value: stats?.todayAppointments ?? 0, icon: '📅', color: 'yellow' },
    { label: 'Total Revenue (₹)', value: `₹${stats?.revenue ?? 0}`, icon: '💰', color: 'purple' },
    { label: 'All Appointments',  value: totalAppts,              icon: '📊', color: 'blue'   },
    { label: 'Completed',         value: getCount('Completed'),   icon: '🏁', color: 'green'  },
    { label: 'Pending',           value: getCount('Pending'),     icon: '🕐', color: 'yellow' },
    { label: 'Cancelled',         value: getCount('Cancelled'),   icon: '❌', color: 'red'    },
  ];

  return (
    <div className="page-container" style={{ animation: 'fadeIn 0.3s ease' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Hospital performance overview</p>
        </div>
      </div>

      <div className="stats-grid">
        {cards.map(c => (
          <div key={c.label} className="stat-card">
            <div className={`stat-icon ${c.color}`}>{c.icon}</div>
            <div className="stat-info">
              <div className="stat-value">{c.value}</div>
              <div className="stat-label">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Appointment Breakdown */}
      {totalAppts > 0 && (
        <div className="card" style={{ marginTop: 24 }}>
          <h2 className="section-title">Appointment Breakdown</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'Completed',  color: 'var(--success)' },
              { label: 'Confirmed',  color: 'var(--accent)'  },
              { label: 'Pending',    color: 'var(--warning)' },
              { label: 'Cancelled',  color: 'var(--danger)'  },
            ].map(row => {
              const val = getCount(row.label);
              const pct = totalAppts > 0 ? Math.round((val / totalAppts) * 100) : 0;
              return (
                <div key={row.label}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom: 6, fontSize: 13 }}>
                    <span style={{ color:'var(--text-secondary)' }}>{row.label}</span>
                    <span style={{ color:'var(--text-primary)', fontWeight: 600 }}>{val} ({pct}%)</span>
                  </div>
                  <div style={{ height: 8, background:'var(--border-light)', borderRadius: 4, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${pct}%`, background: row.color, borderRadius: 4, transition: 'width 0.8s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminAnalytics;
