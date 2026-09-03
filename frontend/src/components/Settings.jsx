import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { Moon, Sun, Globe, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const CURRENCIES = [
  { code: 'USD', label: 'US Dollar ($)' },
  { code: 'EUR', label: 'Euro (€)' },
  { code: 'GBP', label: 'British Pound (£)' },
  { code: 'INR', label: 'Indian Rupee (₹)' },
  { code: 'JPY', label: 'Japanese Yen (¥)' },
  { code: 'AUD', label: 'Australian Dollar (A$)' },
  { code: 'CAD', label: 'Canadian Dollar (C$)' },
];

const Settings = () => {
  const { currency, updateCurrency, theme, toggleTheme } = useSettings();
  const [selectedCurrency, setSelectedCurrency] = useState(currency);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateCurrency(selectedCurrency);
      toast.success('Settings saved successfully!');
    } catch (err) {
      toast.error('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontSize: '0.9rem', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
      <header className="responsive-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className="header-title" style={{ fontSize: '1.5rem' }}>Preferences</h1>
          <p className="header-subtitle" style={{ fontSize: '0.85rem' }}>Manage your global application settings</p>
        </div>
      </header>

      <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Theme Toggle */}
        <div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {theme === 'light' ? <Sun size={20} className="text-primary" /> : <Moon size={20} className="text-primary" />}
            Appearance
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div>
              <div style={{ fontWeight: '600', color: 'var(--text-main)', marginBottom: '0.2rem' }}>Theme Mode</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Toggle between light and dark themes.</div>
            </div>
            <button 
              onClick={toggleTheme}
              style={{
                background: theme === 'light' ? 'var(--text-main)' : 'var(--primary-color)',
                color: theme === 'light' ? 'white' : 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.85rem',
                transition: 'all 0.2s'
              }}
            >
              {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
            </button>
          </div>
        </div>

        {/* Currency Selector */}
        <div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe size={20} className="text-primary" />
            Regional Settings
          </h3>
          <div style={{ padding: '1rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <label style={{ display: 'block', fontWeight: '600', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Base Currency</label>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>This currency will be used across your entire dashboard and transaction history.</p>
            
            <select 
              value={selectedCurrency} 
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="input-field"
              style={{ marginBottom: '0' }}
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            className="btn" 
            onClick={handleSave} 
            disabled={saving || selectedCurrency === currency}
            style={{ padding: '0.75rem 2rem' }}
          >
            <Save size={18} /> {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Settings;
