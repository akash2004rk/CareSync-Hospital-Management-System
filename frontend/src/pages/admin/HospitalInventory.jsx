import { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import toast from 'react-hot-toast';
import { LuPackage, LuTriangleAlert, LuBan, LuCircleDollarSign } from 'react-icons/lu';

const INITIAL_INVENTORY = [
  { id: 1, name: 'Paracetamol 500mg',  category: 'Analgesic',      stock: 1200,  unit: 'Tablets',  status: 'In Stock',    price: 10  },
  { id: 2, name: 'Amoxicillin 250mg',  category: 'Antibiotic',     stock: 450,   unit: 'Capsules', status: 'In Stock',    price: 45  },
  { id: 3, name: 'Insulin Glargine',   category: 'Antidiabetic',   stock: 15,    unit: 'Vials',    status: 'Low Stock',   price: 850 },
  { id: 4, name: 'Atorvastatin 10mg',  category: 'Statin',         stock: 0,     unit: 'Tablets',  status: 'Out of Stock',price: 25  },
  { id: 5, name: 'Salbutamol Inhaler', category: 'Bronchodilator', stock: 85,    unit: 'Units',    status: 'In Stock',    price: 220 },
  { id: 6, name: 'Metformin 500mg',    category: 'Antidiabetic',   stock: 3000,  unit: 'Tablets',  status: 'In Stock',    price: 12  },
  { id: 7, name: 'Surgical Masks',     category: 'Consumables',    stock: 15000, unit: 'Pieces',   status: 'In Stock',    price: 5   },
  { id: 8, name: 'Latex Gloves',       category: 'Consumables',    stock: 200,   unit: 'Pairs',    status: 'Low Stock',   price: 18  },
];

function HospitalInventory() {
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [search, setSearch] = useState('');

  const filtered = inventory.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusClass = (s) => {
    if (s === 'In Stock') return 'badge-success';
    if (s === 'Low Stock') return 'badge-warning';
    return 'badge-danger';
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Pharmacy & Inventory</h1>
          <p className="page-subtitle">Track hospital supplies and medicine stock</p>
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search medicine or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ minWidth: 260 }}
          />
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Items',       value: inventory.length,                                             icon: <LuPackage size={22}/>,         color: 'blue'   },
          { label: 'Low Stock',         value: inventory.filter(i => i.status === 'Low Stock').length,       icon: <LuTriangleAlert size={22}/>,   color: 'yellow' },
          { label: 'Out of Stock',      value: inventory.filter(i => i.status === 'Out of Stock').length,    icon: <LuBan size={22}/>,             color: 'red'    },
          { label: 'Stock Value (Est)', value: '₹4.2L',                                                     icon: <LuCircleDollarSign size={22}/>, color: 'green'  },
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
        {/* Desktop Table View */}
        <div className="table-wrapper hide-mobile">
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Unit</th>
                <th>Price (per unit)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(i => (
                <tr key={i.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{i.name}</td>
                  <td><span className="badge badge-info">{i.category}</span></td>
                  <td style={{ fontWeight: 700 }}>{i.stock}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{i.unit}</td>
                  <td>₹{i.price}</td>
                  <td><span className={`badge ${getStatusClass(i.status)}`}>{i.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="mobile-card-list show-mobile-only">
          {filtered.map(i => (
            <div key={i.id} className="mobile-card">
              <div className="mobile-card-header">
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{i.name}</div>
                <span className={`badge ${getStatusClass(i.status)}`} style={{ fontSize: 10 }}>{i.status}</span>
              </div>
              <div className="mobile-card-body">
                <div className="mobile-card-item">
                  <span className="mobile-card-label">Category</span>
                  <span className="mobile-card-value"><span className="badge badge-info" style={{ fontSize: 10 }}>{i.category}</span></span>
                </div>
                <div className="mobile-card-item">
                  <span className="mobile-card-label">Stock</span>
                  <span className="mobile-card-value" style={{ fontWeight: 700 }}>{i.stock} {i.unit}</span>
                </div>
                <div className="mobile-card-item">
                  <span className="mobile-card-label">Price</span>
                  <span className="mobile-card-value">₹{i.price} / unit</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HospitalInventory;
