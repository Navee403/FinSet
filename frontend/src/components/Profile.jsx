import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { User, Mail } from 'lucide-react';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/profile/');
        setProfileData(res.data);
      } catch (err) {
        console.error('Error fetching profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="loading-state">Loading profile...</div>;
  if (!profileData) return <div className="loading-state">Error loading profile.</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">View your personal information</p>
      </div>

      <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            {profileData.first_name ? profileData.first_name[0].toUpperCase() : <User size={40} />}
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            {profileData.first_name} {profileData.last_name}
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>Member</p>
        </div>

        <div className="settings-section">
          <h3 className="settings-section-title">Personal Details</h3>
          
          <div className="settings-item" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
            <div className="settings-item-info" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <User size={18} className="settings-icon" style={{ color: 'var(--text-muted)' }} />
              <div>
                <p style={{ fontWeight: '500', color: 'var(--text-main)', margin: 0 }}>First Name</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>{profileData.first_name || 'Not provided'}</p>
              </div>
            </div>
          </div>

          <div className="settings-item" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
            <div className="settings-item-info" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <User size={18} className="settings-icon" style={{ color: 'var(--text-muted)' }} />
              <div>
                <p style={{ fontWeight: '500', color: 'var(--text-main)', margin: 0 }}>Last Name</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>{profileData.last_name || 'Not provided'}</p>
              </div>
            </div>
          </div>

          <div className="settings-item" style={{ display: 'flex', alignItems: 'center' }}>
            <div className="settings-item-info" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Mail size={18} className="settings-icon" style={{ color: 'var(--text-muted)' }} />
              <div>
                <p style={{ fontWeight: '500', color: 'var(--text-main)', margin: 0 }}>Email Address</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>{profileData.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
