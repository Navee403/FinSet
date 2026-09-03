import React, { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Users, Plus, CheckCircle, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Debts = () => {
  const { formatCurrency, currency } = useSettings();
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  // New debt form
  const [personName, setPersonName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('lent'); // lent (they owe me) or borrowed (I owe them)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const currencySymbol = new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).formatToParts(1).find(x => x.type === 'currency').value;

  useEffect(() => {
    fetchDebts();
  }, []);

  const fetchDebts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/debts/');
      setDebts(res.data);
    } catch (err) {
      toast.error('Failed to load debts.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDebt = async (e) => {
    e.preventDefault();
    try {
      await api.post('/debts/', {
        person_name: personName,
        type: type,
        amount: parseFloat(amount),
        date: date,
        is_settled: false
      });
      toast.success('Debt recorded successfully!');
      setPersonName('');
      setAmount('');
      fetchDebts();
    } catch (err) {
      toast.error('Failed to record debt.');
    }
  };

  const handleSettle = async (debt) => {
    try {
      await api.put(`/debts/${debt.id}/`, { ...debt, is_settled: true });
      toast.success(`${debt.person_name}'s debt settled!`);
      fetchDebts();
    } catch (err) {
      toast.error('Failed to settle debt.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await api.delete(`/debts/${id}/`);
      toast.success('Record deleted');
      fetchDebts();
    } catch (err) {
      toast.error('Failed to delete record');
    }
  };

  const totalLent = debts.filter(d => d.type === 'lent' && !d.is_settled).reduce((acc, d) => acc + parseFloat(d.amount), 0);
  const totalBorrowed = debts.filter(d => d.type === 'borrowed' && !d.is_settled).reduce((acc, d) => acc + parseFloat(d.amount), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontSize: '0.9rem', width: '100%' }}>
      <header className="header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="header-title" style={{ fontSize: '1.5rem' }}>Lending & Borrowing</h1>
          <p className="header-subtitle" style={{ fontSize: '0.85rem' }}>Track money you owe and money owed to you</p>
        </div>
      </header>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span className="card-title" style={{ fontSize: '0.9rem' }}>People Owe Me</span>
            <span style={{ padding: '0.5rem', background: 'var(--success-light)', color: 'var(--success)', borderRadius: '50%' }}><ArrowUpRight size={20} /></span>
          </div>
          <div className="amount stat-pulse" style={{ fontSize: '1.5rem', color: 'var(--success)', display: 'inline-block' }}>
            {formatCurrency(totalLent)}
          </div>
        </div>
        
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span className="card-title" style={{ fontSize: '0.9rem' }}>I Owe People</span>
            <span style={{ padding: '0.5rem', background: 'var(--danger-light)', color: 'var(--danger)', borderRadius: '50%' }}><ArrowDownRight size={20} /></span>
          </div>
          <div className="amount stat-pulse" style={{ fontSize: '1.5rem', color: 'var(--danger)', display: 'inline-block' }}>
            {formatCurrency(totalBorrowed)}
          </div>
        </div>
      </div>

      <div className="responsive-grid-1-2">
        
        {/* Create Form */}
        <div className="card" style={{ padding: '1.5rem', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} className="text-primary" /> New Record
          </h3>
          <form onSubmit={handleCreateDebt}>
            
            <div style={{ display: 'flex', background: 'var(--bg-main)', padding: '0.25rem', borderRadius: 'var(--radius-lg)', marginBottom: '1rem' }}>
              <button 
                type="button" 
                onClick={() => setType('lent')}
                style={{ flex: 1, padding: '0.5rem', border: 'none', borderRadius: 'var(--radius-md)', background: type === 'lent' ? 'var(--success)' : 'transparent', color: type === 'lent' ? 'white' : 'var(--text-muted)', fontWeight: '600', cursor: 'pointer' }}
              >
                I Lent Money
              </button>
              <button 
                type="button" 
                onClick={() => setType('borrowed')}
                style={{ flex: 1, padding: '0.5rem', border: 'none', borderRadius: 'var(--radius-md)', background: type === 'borrowed' ? 'var(--danger)' : 'transparent', color: type === 'borrowed' ? 'white' : 'var(--text-muted)', fontWeight: '600', cursor: 'pointer' }}
              >
                I Borrowed
              </button>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.85rem' }}>Person's Name</label>
              <input 
                type="text" 
                required
                placeholder="e.g. John Doe"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                className="input-field"
                style={{ marginBottom: 0 }}
              />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.85rem' }}>Amount</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ position: 'absolute', left: '1rem', color: 'var(--text-light)', fontWeight: 600 }}>{currencySymbol}</span>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-field"
                  style={{ marginBottom: 0, paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.85rem' }}>Date</label>
              <input 
                type="date" 
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-field"
                style={{ marginBottom: 0 }}
              />
            </div>

            <button type="submit" className="btn" style={{ width: '100%', background: type === 'lent' ? 'var(--success)' : 'var(--danger)' }}>
              Save Record
            </button>
          </form>
        </div>

        {/* Debts List */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={18} className="text-primary" /> Active Records
          </h3>
          
          <div style={{ overflowY: 'auto', flex: 1 }}>
            <table className="interactive-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
                ) : debts.length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No records found.</td></tr>
                ) : (
                  debts.map(d => (
                    <tr key={d.id} style={{ opacity: d.is_settled ? 0.6 : 1 }}>
                      <td>
                        {d.person_name}
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>{d.date}</div>
                      </td>
                      <td>
                        <span className={`badge ${d.type === 'lent' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.75rem' }}>
                          {d.type === 'lent' ? 'Lent' : 'Borrowed'}
                        </span>
                        {d.is_settled && <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', color: 'var(--success)', fontWeight: 'bold' }}>✓ Settled</span>}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: d.type === 'lent' ? 'var(--success)' : 'var(--danger)' }}>
                        {formatCurrency(d.amount)}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          {!d.is_settled && (
                            <button onClick={() => handleSettle(d)} title="Mark as settled" style={{ background: 'var(--success-light)', border: 'none', cursor: 'pointer', color: 'var(--success)', padding: '0.4rem', borderRadius: '50%' }}>
                              <CheckCircle size={14} />
                            </button>
                          )}
                          <button onClick={() => handleDelete(d.id)} title="Delete record" style={{ background: 'var(--danger-light)', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: '0.4rem', borderRadius: '50%' }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Debts;
