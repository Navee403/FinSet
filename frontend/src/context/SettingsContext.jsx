import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [currency, setCurrency] = useState('USD');
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(true);

  // Define currency formatters
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  useEffect(() => {
    // Load theme from local storage if available
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Fetch user profile for currency
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          const res = await api.get('/auth/profile/');
          if (res.data.profile && res.data.profile.preferred_currency) {
            setCurrency(res.data.profile.preferred_currency);
          }
        }
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const updateCurrency = async (newCurrency) => {
    try {
      await api.put('/auth/profile/', { preferred_currency: newCurrency });
      setCurrency(newCurrency);
    } catch (err) {
      console.error('Failed to update currency', err);
      throw err;
    }
  };

  return (
    <SettingsContext.Provider value={{ currency, theme, toggleTheme, updateCurrency, formatCurrency, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};
