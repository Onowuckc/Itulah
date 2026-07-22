'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useFeatures } from '@/context/FeatureContext';
import styles from './page.module.css';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const noticeParam = searchParams.get('notice');
  const redirectParam = searchParams.get('redirect') || '/account';

  const { login } = useAuth();
  const { flags, loading: flagsLoading } = useFeatures();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        router.push(redirectParam);
      } else {
        setErrorMsg(res.error || 'Invalid credentials');
      }
    } catch (err) {
      setErrorMsg('Login failed. Please check network connection.');
    } finally {
      setIsLoading(false);
    }
  };

  if (flagsLoading) return <div className={styles.loading}>Loading...</div>;

  if (!flags.feature_auth) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.icon}>🔒</div>
          <h2>Customer Authentication Off</h2>
          <p>Customer accounts are currently locked by admin discretion.</p>
          <Link href="/products" className={styles.btn}>Return to Showcase</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Customer Sign In</h1>
        <p className={styles.subtitle}>Welcome back to Itulah Nigeria Customer Portal</p>

        {noticeParam && (
          <div className={styles.noticeAlert}>
            🔒 {noticeParam}
          </div>
        )}

        {errorMsg && <div className={styles.errorAlert}>{errorMsg}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. customer@example.com"
            />
          </div>

          <div className={styles.field}>
            <label>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={isLoading} className={styles.submitBtn}>
            {isLoading ? 'Signing In...' : 'Sign In to Account'}
          </button>
        </form>

        <div className={styles.footerLink}>
          Don't have an account yet? <Link href={`/register${redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ''}`}>Create Account</Link>
        </div>
      </div>
    </div>
  );
}

export default function CustomerLoginPage() {
  return (
    <Suspense fallback={<div className={styles.loading}>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
