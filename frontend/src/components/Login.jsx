import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { LogIn, User, Lock, ArrowRight, Wallet } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login/', {
        username: email,
        password
      });
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-card">
      {/* Left Abstract Illustration Panel */}
      <div className="auth-left">
        <img src="/auth-bg.png" alt="Abstract Wealth" className="auth-bg-img" />
        <div className="auth-left-content">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <Wallet size={20} />
            </div>
            ExpenseTracker
          </div>
          
          <div className="auth-quote-container">
            <p className="auth-quote">"Tracking your expenses is the first step towards taking control of your financial future and building lasting wealth."</p>
            <div className="auth-author">
              <div style={{ width: '20px', height: '2px', backgroundColor: 'white', borderRadius: '2px' }}></div>
              Financial Wisdom
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="auth-right">
        <div className="auth-header">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Enter your credentials to access your dashboard.</p>
        </div>

        {error && (
          <div style={{ padding: '0.8rem 1rem', background: 'var(--danger-light)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: '500', border: '1px solid #fecaca' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="auth-form-group">
            <label className="auth-label">Email Address</label>
            <div className="auth-input-wrapper">
              <User size={18} className="auth-input-icon" />
              <input 
                type="email" 
                className="auth-input" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Password</label>
            <div className="auth-input-wrapper">
              <Lock size={18} className="auth-input-icon" />
              <input 
                type="password" 
                className="auth-input" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Authenticating...' : (
              <>Sign In <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register" className="auth-link">Create one now</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
