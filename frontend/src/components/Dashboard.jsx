import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import api from '../services/api';
import {
  ArrowUpRight, ArrowDownRight, TrendingDown, TrendingUp, Wallet, Target,
  Home, Coffee, Car, Zap, Film, ShoppingBag, HeartPulse, MoreHorizontal, 
  Briefcase, History, Calendar as CalendarIcon, X, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const COLORS = ['#4f46e5', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#14b8a6', '#3b82f6', '#6366f1'];

const CATEGORY_LABELS = {
  housing: 'Housing', food: 'Food', transport: 'Transport', utilities: 'Utilities',
  entertainment: 'Fun', shopping: 'Shopping', health: 'Health', other: 'Other'
};

const CATEGORY_ICONS = {
  housing: <Home size={16} />, food: <Coffee size={16} />, transport: <Car size={16} />, utilities: <Zap size={16} />,
  entertainment: <Film size={16} />, shopping: <ShoppingBag size={16} />, health: <HeartPulse size={16} />, other: <MoreHorizontal size={16} />
};

// --- Calendar Overlay Component ---
const CalendarOverlay = ({ isOpen, onClose, transactions, formatCurrency }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  if (!isOpen) return null;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)
  
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const blanks = Array(firstDayOfMonth).fill(null);
  const days = Array.from({length: daysInMonth}, (_, i) => i + 1);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="card" style={{ width: '100%', height: '100%', maxWidth: '1600px', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
        
        {/* Calendar Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-panel)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarIcon size={18} />
            </div>
            <h2 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--text-main)' }}>Transaction Calendar</h2>
          </div>
          <button onClick={onClose} style={{ background: 'var(--bg-main)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-light)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Calendar Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1.5rem', background: 'var(--bg-main)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
            {monthNames[month]} {year}
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={prevMonth} className="icon-btn" style={{ width: '32px', height: '32px' }}><ChevronLeft size={16} /></button>
            <button onClick={nextMonth} className="icon-btn" style={{ width: '32px', height: '32px' }}><ChevronRight size={16} /></button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--border-color)', gap: '1px', minHeight: 0 }}>
          {/* Days Header */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: 'var(--bg-panel)', gap: '1px' }}>
            {dayNames.map(day => (
              <div key={day} style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Body */}
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: '1fr', background: 'var(--border-color)', gap: '1px', overflowY: 'auto' }}>
            {blanks.map((_, i) => (
              <div key={`blank-${i}`} style={{ background: 'var(--bg-main)', opacity: 0.5 }}></div>
            ))}
            
            {days.map(day => {
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayTransactions = transactions.filter(t => (t.date || t.created_at).startsWith(dateStr));
              
              const dayIncome = dayTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
              const dayExpense = dayTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
              
              const isToday = new Date().toISOString().startsWith(dateStr);

              return (
                <div key={day} style={{ background: 'var(--bg-panel)', padding: '0.4rem', display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: '80px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <span style={{ 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      width: '24px', height: '24px', borderRadius: '50%', 
                      fontWeight: 700, fontSize: '0.8rem',
                      background: isToday ? 'var(--primary-color)' : 'transparent',
                      color: isToday ? '#fff' : 'var(--text-main)'
                    }}>
                      {day}
                    </span>
                  </div>
                  
                  <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.15rem', paddingRight: '2px' }}>
                    {dayTransactions.map((t, idx) => (
                      <div key={idx} style={{ 
                        fontSize: '0.65rem', padding: '0.15rem 0.3rem', borderRadius: '3px', 
                        background: t.type === 'income' ? 'var(--success-light)' : 'var(--danger-light)',
                        color: t.type === 'income' ? 'var(--success)' : 'var(--danger)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 600 }}>{t.title}</span>
                        <span style={{ fontWeight: 800 }}>{formatCurrency(t.amount)}</span>
                      </div>
                    ))}
                  </div>
                  
                  {(dayIncome > 0 || dayExpense > 0) && (
                    <div style={{ marginTop: '0.25rem', paddingTop: '0.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', fontWeight: 800 }}>
                      <span style={{ color: 'var(--success)' }}>{dayIncome > 0 ? `+${formatCurrency(dayIncome)}` : ''}</span>
                      <span style={{ color: 'var(--danger)' }}>{dayExpense > 0 ? `-${formatCurrency(dayExpense)}` : ''}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};


const Dashboard = () => {
  const [data, setData] = useState({
    total_income: 0, total_expense: 0, balance: 0, expenses_by_category: []
  });
  const [cashFlowData, setCashFlowData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [budgetSpends, setBudgetSpends] = useState({});
  const [loading, setLoading] = useState(true);
  
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const { formatCurrency } = useSettings();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [dashRes, incRes, expRes, budRes] = await Promise.all([
          api.get('/dashboard/'),
          api.get('/incomes/'),
          api.get('/expenses/'),
          api.get('/budgets/')
        ]);

        const formattedPieData = dashRes.data.expenses_by_category.map(item => ({
          name: CATEGORY_LABELS[item.category] || item.category,
          value: parseFloat(item.amount),
          originalCategory: item.category
        }));

        setData({ ...dashRes.data, expenses_by_category: formattedPieData });

        const incomes = incRes.data.map(i => ({ ...i, type: 'income', title: i.source, amount: parseFloat(i.amount) }));
        const expenses = expRes.data.map(e => ({ ...e, type: 'expense', title: e.description || e.category, amount: parseFloat(e.amount) }));
        const combined = [...incomes, ...expenses].sort((a, b) => new Date(b.date || b.created_at) - new Date(a.date || a.created_at));
        
        setAllTransactions(combined);
        setRecentActivity(combined.slice(0, 5));

        const daysMap = {};
        const currentMonthPrefix = new Date().toISOString().slice(0, 7); 
        
        incomes.forEach(i => { if(i.date.startsWith(currentMonthPrefix)) { daysMap[i.date] = { name: i.date.split('-')[2], income: 0, expense: 0 }; }});
        expenses.forEach(e => { if(e.date.startsWith(currentMonthPrefix)) { daysMap[e.date] = { name: e.date.split('-')[2], income: 0, expense: 0 }; }});
        
        incomes.forEach(i => { if(daysMap[i.date]) daysMap[i.date].income += i.amount; });
        expenses.forEach(e => { if(daysMap[e.date]) daysMap[e.date].expense += e.amount; });
        
        const chartData = Object.keys(daysMap).sort().map(date => daysMap[date]);
        setCashFlowData(chartData);

        setBudgets(budRes.data.slice(0, 3)); 
        const spends = {};
        expenses.forEach(e => {
          if (e.date.startsWith(currentMonthPrefix)) {
            spends[e.category] = (spends[e.category] || 0) + e.amount;
          }
        });
        setBudgetSpends(spends);

        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 401) navigate('/login');
        setLoading(false);
      }
    };
    fetchAllData();
  }, [navigate]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>Loading Analytics...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%', fontSize: '0.85rem', width: '100%' }}>
      
      <CalendarOverlay 
        isOpen={isCalendarOpen} 
        onClose={() => setIsCalendarOpen(false)} 
        transactions={allTransactions} 
        formatCurrency={formatCurrency} 
      />

      <header className="responsive-header">
        <div>
          <h1 className="header-title" style={{ fontSize: '1.5rem' }}>Financial Overview</h1>
          <p className="header-subtitle" style={{ fontSize: '0.85rem' }}>Your complete money analysis</p>
        </div>
        <button onClick={() => setIsCalendarOpen(true)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <CalendarIcon size={16} /> View Calendar
        </button>
      </header>

      {/* Top 4 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        
        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Wallet size={14} className="text-primary" /> Current Balance
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>{formatCurrency(data.balance)}</div>
        </div>

        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={14} className="text-success" /> Monthly Income
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success)' }}>{formatCurrency(data.total_income)}</div>
        </div>

        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingDown size={14} className="text-danger" /> Monthly Expenses
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--danger)' }}>{formatCurrency(data.total_expense)}</div>
        </div>

        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={14} color="#f59e0b" /> Net Savings
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: (data.total_income - data.total_expense) >= 0 ? 'var(--primary-color)' : 'var(--danger)' }}>
            {formatCurrency(data.total_income - data.total_expense)}
          </div>
        </div>

      </div>

      <div className="responsive-grid-2-1" style={{ alignItems: 'start' }}>
        
        {/* Cash Flow Chart */}
        <div className="card" style={{ padding: '1.5rem', height: '100%', minHeight: '350px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} className="text-primary" /> Cash Flow Analysis
          </h3>
          <div style={{ flex: 1, minHeight: '250px' }}>
            {cashFlowData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cashFlowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--success)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--danger)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-light)' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-light)' }} tickFormatter={val => formatCurrency(val)} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)', fontSize: '0.8rem', background: 'var(--bg-panel)', color: 'var(--text-main)' }} />
                  <Area type="monotone" dataKey="income" name="Income" stroke="var(--success)" strokeWidth={3} fillOpacity={1} fill="url(#colorInc)" />
                  <Area type="monotone" dataKey="expense" name="Expense" stroke="var(--danger)" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No data for this month yet.</div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card" style={{ padding: '1.5rem', height: '100%', minHeight: '350px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <History size={18} className="text-primary" /> Recent Activity
            </h3>
            <button onClick={() => navigate('/history')} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>View All</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentActivity.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>No recent activity.</div>
            ) : (
              recentActivity.map((t, i) => {
                const isInc = t.type === 'income';
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: i !== recentActivity.length -1 ? '1px solid var(--border-color)' : 'none' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: isInc ? 'var(--success-light)' : 'var(--bg-main)', color: isInc ? 'var(--success)' : 'var(--text-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {isInc ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.date}</div>
                    </div>
                    <div style={{ fontWeight: 700, color: isInc ? 'var(--success)' : 'var(--text-main)' }}>
                      {isInc ? '+' : '-'}{formatCurrency(t.amount)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      <div className="responsive-grid-2-1" style={{ alignItems: 'start', marginBottom: '2rem' }}>
        
        {/* Expenses Breakdown */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Category Breakdown</h3>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
            <div style={{ width: '200px', height: '200px', position: 'relative' }}>
              {data.expenses_by_category.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={data.expenses_by_category} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                        {data.expenses_by_category.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={val => formatCurrency(val)} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)', fontSize: '0.8rem' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Total</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800 }}>{formatCurrency(data.total_expense)}</div>
                  </div>
                </>
              ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No data</div>
              )}
            </div>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {data.expenses_by_category.slice(0, 5).map((cat, i) => {
                const icon = CATEGORY_ICONS[cat.originalCategory] || <MoreHorizontal size={14} />;
                const percentage = ((cat.value / data.total_expense) * 100).toFixed(0);
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ color: COLORS[i % COLORS.length] }}>{icon}</div>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{cat.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{percentage}%</span>
                      <span style={{ fontWeight: 700, width: '60px', textAlign: 'right' }}>{formatCurrency(cat.value)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Budgets Health */}
        <div className="card" style={{ padding: '1.5rem', height: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={18} color="#f59e0b" /> Top Budgets
            </h3>
            <button onClick={() => navigate('/budgets')} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Manage</button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {budgets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1rem 0', color: 'var(--text-muted)' }}>No active budgets.</div>
            ) : (
              budgets.map(b => {
                const limit = parseFloat(b.amount);
                const spent = budgetSpends[b.category] || 0;
                const percentage = Math.min((spent / limit) * 100, 100);
                const isOver = spent > limit;
                const catLabel = CATEGORY_LABELS[b.category] || b.category;
                
                return (
                  <div key={b.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{catLabel}</span>
                      <span style={{ fontWeight: 700, color: isOver ? 'var(--danger)' : 'var(--text-main)' }}>
                        {formatCurrency(spent)} <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>/ {formatCurrency(limit)}</span>
                      </span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--bg-main)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${percentage}%`, background: isOver ? 'var(--danger)' : 'var(--primary-color)', borderRadius: '3px' }}></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
