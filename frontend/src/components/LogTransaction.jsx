import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  Save, AlertCircle,
  Home, Coffee, Car, Zap,
  Film, ShoppingBag, HeartPulse, MoreHorizontal,
  Briefcase, TrendingUp, History, ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useSettings } from '../context/SettingsContext';

const CATEGORY_CHOICES = [
  { value: 'housing', label: 'Housing', icon: Home, color: '#3b82f6' },
  { value: 'food', label: 'Food', icon: Coffee, color: '#ef4444' },
  { value: 'transport', label: 'Transport', icon: Car, color: '#f59e0b' },
  { value: 'utilities', label: 'Utilities', icon: Zap, color: '#10b981' },
  { value: 'entertainment', label: 'Fun', icon: Film, color: '#8b5cf6' },
  { value: 'shopping', label: 'Shopping', icon: ShoppingBag, color: '#ec4899' },
  { value: 'health', label: 'Health', icon: HeartPulse, color: '#14b8a6' },
  { value: 'other', label: 'Other', icon: MoreHorizontal, color: '#64748b' },
];

const INCOME_SOURCES = [
  { value: 'salary', label: 'Salary', icon: Briefcase, color: '#10b981' },
  { value: 'investment', label: 'Investment', icon: TrendingUp, color: '#3b82f6' },
  { value: 'other', label: 'Other', icon: MoreHorizontal, color: '#64748b' },
];

const LogTransaction = () => {
  const [type, setType] = useState('expense'); // 'income' or 'expense'
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('food');
  const [incomeSource, setIncomeSource] = useState('salary');
  const [description, setDescription] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState([]);

  const { currency, formatCurrency } = useSettings();
  const currencySymbol = new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).formatToParts(1).find(x => x.type === 'currency').value;
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecent();
  }, []);

  const fetchRecent = async () => {
    try {
      const [incRes, expRes] = await Promise.all([
        api.get('/incomes/'),
        api.get('/expenses/')
      ]);
      const incomes = incRes.data.map(i => ({ ...i, type: 'income', displayTitle: i.source }));
      const expenses = expRes.data.map(e => ({ ...e, type: 'expense', displayTitle: e.description || e.category }));
      const combined = [...incomes, ...expenses].sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date)).slice(0, 5);
      setRecentTransactions(combined);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (type === 'income') {
        await api.post('/incomes/', {
          source: incomeSource === 'other' ? description || 'Other Income' : INCOME_SOURCES.find(i => i.value === incomeSource).label,
          amount: parseFloat(amount),
          date: date,
          is_recurring: isRecurring
        });
        toast.success('Income logged successfully!');
      } else {
        await api.post('/expenses/', {
          category: category,
          description: description || CATEGORY_CHOICES.find(c => c.value === category).label,
          amount: parseFloat(amount),
          date: date,
          is_recurring: isRecurring
        });
        toast.success('Expense logged successfully!');
      }

      setAmount('');
      setDescription('');
      fetchRecent(); // Refresh the list instantly
    } catch (err) {
      toast.error('Failed to log transaction. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontSize: '0.85rem', width: '100%', margin: '0 auto' }}>
      <header className="responsive-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className="header-title" style={{ fontSize: '1.5rem' }}>Transactions</h1>
          <p className="header-subtitle" style={{ fontSize: '0.85rem' }}>Record a new expense or income</p>
        </div>
      </header>

      <div className="responsive-grid-2-1" style={{ alignItems: 'start' }}>

        {/* Left Column: Log Form */}
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>

          {/* Header Toggle */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)' }}>
            <button
              type="button"
              onClick={() => { setType('expense'); }}
              style={{
                flex: 1, padding: '1rem', border: 'none', background: type === 'expense' ? 'var(--bg-panel)' : 'var(--bg-main)',
                color: type === 'expense' ? 'var(--primary-color)' : 'var(--text-muted)',
                fontWeight: type === 'expense' ? '700' : '500', fontSize: '0.95rem', cursor: 'pointer',
                borderBottom: type === 'expense' ? '2px solid var(--primary-color)' : '2px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              Add Expense
            </button>
            <button
              type="button"
              onClick={() => { setType('income'); }}
              style={{
                flex: 1, padding: '1rem', border: 'none', background: type === 'income' ? 'var(--bg-panel)' : 'var(--bg-main)',
                color: type === 'income' ? 'var(--success)' : 'var(--text-muted)',
                fontWeight: type === 'income' ? '700' : '500', fontSize: '0.95rem', cursor: 'pointer',
                borderBottom: type === 'income' ? '2px solid var(--success)' : '2px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              Add Income
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>

            {/* Amount Input */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '0.25rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Enter Amount
              </label>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: '800', color: type === 'expense' ? 'var(--text-main)' : 'var(--success)' }}>{currencySymbol}</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{
                    fontSize: '2.5rem', fontWeight: '800', border: 'none', background: 'transparent',
                    width: amount.length > 0 ? `${Math.max(4, amount.length)}ch` : '4ch',
                    color: type === 'expense' ? 'var(--text-main)' : 'var(--success)',
                    outline: 'none', textAlign: 'center', padding: 0
                  }}
                />
              </div>
            </div>

            <div className="responsive-grid-2" style={{ marginBottom: '2rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-main)', fontWeight: '600', fontSize: '0.85rem' }}>Date</label>
                <input
                  type="date"
                  className="input-field"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  style={{ padding: '0.75rem', background: 'var(--bg-main)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-main)', fontWeight: '600', fontSize: '0.85rem' }}>
                  {type === 'expense' ? 'Note / Description' : 'Note (Optional)'}
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="What was this for?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required={type === 'expense' && category === 'other'}
                  style={{ padding: '0.75rem', background: 'var(--bg-main)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            {/* Category Selector */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-main)', fontWeight: '600', fontSize: '0.85rem' }}>
                Select Category
              </label>

              {type === 'expense' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  {CATEGORY_CHOICES.map((c) => {
                    const Icon = c.icon;
                    const isSelected = category === c.value;
                    return (
                      <div
                        key={c.value}
                        onClick={() => setCategory(c.value)}
                        style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem',
                          padding: '0.75rem 0.25rem', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                          background: isSelected ? `${c.color}15` : 'var(--bg-main)',
                          border: `2px solid ${isSelected ? c.color : 'transparent'}`,
                          transition: 'all 0.2s',
                          boxShadow: isSelected ? 'none' : 'inset 0 0 0 1px var(--border-color)'
                        }}
                      >
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '50%',
                          background: isSelected ? c.color : '#fff',
                          color: isSelected ? '#fff' : c.color,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: isSelected ? `0 2px 8px ${c.color}40` : 'var(--shadow-sm)'
                        }}>
                          <Icon size={16} />
                        </div>
                        <span style={{ fontSize: '0.7rem', fontWeight: isSelected ? '700' : '500', color: isSelected ? 'var(--text-main)' : 'var(--text-muted)' }}>
                          {c.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  {INCOME_SOURCES.map((c) => {
                    const Icon = c.icon;
                    const isSelected = incomeSource === c.value;
                    return (
                      <div
                        key={c.value}
                        onClick={() => setIncomeSource(c.value)}
                        style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem',
                          padding: '0.75rem 0.25rem', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                          background: isSelected ? `${c.color}15` : 'var(--bg-main)',
                          border: `2px solid ${isSelected ? c.color : 'transparent'}`,
                          transition: 'all 0.2s',
                          boxShadow: isSelected ? 'none' : 'inset 0 0 0 1px var(--border-color)'
                        }}
                      >
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '50%',
                          background: isSelected ? c.color : '#fff',
                          color: isSelected ? '#fff' : c.color,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: isSelected ? `0 2px 8px ${c.color}40` : 'var(--shadow-sm)'
                        }}>
                          <Icon size={16} />
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: isSelected ? '700' : '500', color: isSelected ? 'var(--text-main)' : 'var(--text-muted)' }}>
                          {c.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)' }}>
              <input
                type="checkbox"
                id="recurringCheck"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--primary-color)', cursor: 'pointer' }}
              />
              <label htmlFor="recurringCheck" style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: '600', cursor: 'pointer' }}>
                Mark as Recurring (automatically log this every month)
              </label>
            </div>

            <button
              type="submit"
              className="btn"
              disabled={submitting}
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-md)',
                background: type === 'expense' ? 'var(--primary-color)' : 'var(--success)',
                boxShadow: type === 'expense' ? '0 4px 14px -2px rgba(124, 58, 237, 0.4)' : '0 4px 14px -2px rgba(16, 185, 129, 0.4)'
              }}
            >
              <Save size={16} style={{ marginRight: '0.5rem' }} />
              {submitting ? 'Processing...' : `Confirm ${type === 'expense' ? 'Expense' : 'Income'}`}
            </button>
          </form>
        </div>

        {/* Right Column: Mini History Feed */}
        <div style={{ position: 'sticky', top: '1rem' }}>
          <div className="card" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <History size={16} className="text-primary" /> Recent Activity
              </h3>
              <button
                onClick={() => navigate('/history')}
                style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
              >
                View All <ArrowRight size={12} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentTransactions.length === 0 ? (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No recent transactions found.
                </div>
              ) : (
                recentTransactions.map((t, idx) => {
                  const isInc = t.type === 'income';
                  let iconElement = <MoreHorizontal size={16} />;
                  let bgColor = '#64748b';

                  if (isInc) {
                    const sourceObj = INCOME_SOURCES.find(s => s.value === t.source.toLowerCase()) || INCOME_SOURCES.find(s => s.label.toLowerCase() === t.source.toLowerCase());
                    if (sourceObj) { iconElement = <sourceObj.icon size={16} />; bgColor = sourceObj.color; }
                  } else {
                    const catObj = CATEGORY_CHOICES.find(c => c.value === t.category);
                    if (catObj) { iconElement = <catObj.icon size={16} />; bgColor = catObj.color; }
                  }

                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: idx !== recentTransactions.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `${bgColor}15`, color: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {iconElement}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {t.displayTitle}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t.date}</div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: isInc ? 'var(--success)' : 'var(--text-main)' }}>
                        {isInc ? '+' : '-'}{formatCurrency(t.amount)}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LogTransaction;
