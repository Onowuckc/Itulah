'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './layout.module.css';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === '/admin/login';

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/admin/login');
      if (res.ok) {
        router.push('/admin/login');
        router.refresh();
      }
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (isLoginPage) {
    return <div className={styles.loginWrapper}>{children}</div>;
  }

  return (
    <div className={styles.adminContainer}>
      {/* Glassmorphic Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandGlow}>ITULAH</span>
          <span className={styles.brandSub}>CMS PORTAL</span>
        </div>
        
        <nav className={styles.navMenu}>
          <Link href="/admin/dashboard" className={`${styles.navLink} ${pathname === '/admin/dashboard' ? styles.active : ''}`}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
            </svg>
            Dashboard
          </Link>
          <Link href="/admin/products" className={`${styles.navLink} ${pathname === '/admin/products' ? styles.active : ''}`}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Products
          </Link>
          <Link href="/admin/blog" className={`${styles.navLink} ${pathname === '/admin/blog' ? styles.active : ''}`}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            Blog & News
          </Link>
          <Link href="/admin/features" className={`${styles.navLink} ${pathname === '/admin/features' ? styles.active : ''}`}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Feature Rollout
          </Link>
          <Link href="/admin/orders" className={`${styles.navLink} ${pathname === '/admin/orders' ? styles.active : ''}`}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Customer Orders
          </Link>
          <Link href="/admin/profile" className={`${styles.navLink} ${pathname === '/admin/profile' ? styles.active : ''}`}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profile Settings
          </Link>
        </nav>
        
        <div className={styles.sidebarFooter}>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>
      
      {/* Main Content Area */}
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
