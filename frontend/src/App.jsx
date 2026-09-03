import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SettingsProvider } from './context/SettingsContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import LogTransaction from './components/LogTransaction';
import History from './components/History';
import Budget from './components/Budget';
import Debts from './components/Debts';
import Sidebar from './components/Sidebar';
import Settings from './components/Settings';
import Profile from './components/Profile';

const AppLayout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  
  if (isAuthPage) {
    return <div className="auth-layout">{children}</div>;
  }

  return (
    <div className="app-layout">
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <SettingsProvider>
      <Toaster position="top-right" toastOptions={{
        style: {
          borderRadius: '12px',
          background: 'var(--bg-panel)',
          color: 'var(--text-main)',
          border: '1px solid var(--border-color)',
        }
      }} />
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/log-transaction" element={<LogTransaction />} />
            <Route path="/history" element={<History />} />
            <Route path="/budgets" element={<Budget />} />
            <Route path="/debts" element={<Debts />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </AppLayout>
      </Router>
    </SettingsProvider>
  );
}

export default App;
