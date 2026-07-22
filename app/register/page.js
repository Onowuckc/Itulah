'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useFeatures } from '@/context/FeatureContext';
import styles from '../login/page.module.css';

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect') || '/account';

  const { register } = useAuth();
  const { flags, loading: flagsLoading } = useFeatures();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    city: 'Lagos',
    state: 'Lagos State'
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await register(formData);
      if (res.success) {
        router.push(redirectParam);
      } else {
        setErrorMsg(res.error || 'Registration failed.');
      }
    } catch (err) {
      setErrorMsg('Error creating account. Please try again.');
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
          <p>Customer registration is currently turned off by administrator discretion.</p>
          <Link href="/products" className={styles.btn}>Return to Showcase</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card} style={{ maxWidth: '520px' }}>
        <h1 className={styles.title}>Create Customer Account</h1>
        <p className={styles.subtitle}>Register to track orders, save shipping address, and manage profile</p>

        {errorMsg && <div className={styles.errorAlert}>{errorMsg}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Dr. Babatunde Lawal"
            />
          </div>

          <div className={styles.field}>
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. babatunde@example.com"
            />
          </div>

          <div className={styles.field}>
            <label>Password *</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Create secure password"
            />
          </div>

          <div className={styles.field}>
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+234 803 123 4567"
            />
          </div>

          <div className={styles.field}>
            <label>Default Shipping Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street address, Victoria Island / Ikeja..."
            />
          </div>

          <button type="submit" disabled={isLoading} className={styles.submitBtn}>
            {isLoading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <div className={styles.footerLink}>
          Already registered? <Link href={`/login${redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ''}`}>Sign In</Link>
        </div>
      </div>
    </div>
  );
}

export default function CustomerRegisterPage() {
  return (
    <Suspense fallback={<div className={styles.loading}>Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
