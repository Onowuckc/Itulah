'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await res.json();
      if (res.ok) {
        // Redirect to dashboard on success
        router.push('/admin/dashboard');
        router.refresh();
      } else {
        setError(data.error || 'Incorrect admin password.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>CMS Login</h1>
        <p className={styles.subtitle}>Enter password to manage Itulah Nigeria database</p>
        
        <form onSubmit={handleLogin}>
          {error && <div className={styles.errorMessage}>{error}</div>}
          
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">Administrator Password</label>
            <input
              type="password"
              id="password"
              className={styles.input}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
            />
          </div>
          
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Authenticating...' : 'Access Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
