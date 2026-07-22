'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/app/admin/dashboard/page.module.css';

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login');
      if (res.ok) {
        router.push('/admin/login');
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleLogout} className={styles.logoutBtn} disabled={loading}>
      {loading ? 'Logging out...' : 'Log Out'}
    </button>
  );
}
