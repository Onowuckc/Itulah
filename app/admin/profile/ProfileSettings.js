'use client';

import { useState } from 'react';
import styles from './ProfileSettings.module.css';

export default function ProfileSettings() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [alert, setAlert] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: '', message: '' });

    if (formData.newPassword !== formData.confirmPassword) {
      setAlert({ type: 'error', message: 'New passwords do not match.' });
      return;
    }

    if (formData.newPassword.length < 4) {
      setAlert({ type: 'error', message: 'New password must be at least 4 characters long.' });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      const data = await res.json();
      if (res.ok) {
        setAlert({ type: 'success', message: 'Admin password updated successfully!' });
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setAlert({ type: 'error', message: data.error || 'Failed to update password.' });
      }
    } catch (err) {
      console.error(err);
      setAlert({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Account Profile Settings</h1>
          <p style={{ color: 'var(--color-text-muted-dark)', marginTop: '4px', fontSize: '14px' }}>
            Manage and update your administrator access credentials
          </p>
        </div>
      </div>

      {alert.message && (
        <div className={alert.type === 'success' ? styles.successAlert : styles.errorAlert}>
          {alert.message}
        </div>
      )}

      <div className={styles.formBlock}>
        <h3 className={styles.formTitle}>Change Administrator Password</h3>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Current Admin Password</label>
            <input
              type="password"
              name="currentPassword"
              className={styles.input}
              required
              value={formData.currentPassword}
              onChange={handleInputChange}
              placeholder="••••••••••••"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>New Admin Password</label>
            <input
              type="password"
              name="newPassword"
              className={styles.input}
              required
              value={formData.newPassword}
              onChange={handleInputChange}
              placeholder="Min 4 characters"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              className={styles.input}
              required
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm new password"
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Saving Changes...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
