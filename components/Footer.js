'use client';

import Link from 'next/link';
import { useFeatures } from '@/context/FeatureContext';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { flags } = useFeatures();

  const socialLinks = [
    { name: 'PULS Nutrition', handle: '@Pulsnutrition_nigeria', url: 'https://instagram.com/Pulsnutrition_nigeria' },
    { name: 'Mikraid NG', handle: '@mikraidng', url: 'https://instagram.com/mikraidng' },
    { name: 'Wild Octopus', handle: '@wildoctopus_mikraid', url: 'https://instagram.com/wildoctopus_mikraid' },
    { name: 'Country Pride', handle: '@countrypride_mikraid', url: 'https://instagram.com/countrypride_mikraid' },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Company Column */}
        <div className={styles.column}>
          <h3 className={styles.brandTitle}>ITULAH</h3>
          <p className={styles.brandText}>
            Itulah Nigeria Limited is a highly diversified organization dedicated to delivering premium spirits & beverages, fine fragrances, and high-quality consumer products across Nigeria since 1989.
          </p>
        </div>

        {/* Quick Links Column */}
        <div className={styles.column}>
          <h4 className={styles.colTitle}>Quick Links</h4>
          <ul className={styles.linksList}>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/products">Products & Services</Link></li>
            <li><Link href="/gallery">Gallery Catalog</Link></li>
            <li><Link href="/blog">Blog & News</Link></li>
            <li><Link href="/quote">Request a Quote</Link></li>

            {/* Dynamically shown when Auth/Dashboard feature flags are ON */}
            {flags.feature_auth && (
              <li><Link href="/login">Customer Sign In</Link></li>
            )}
            {flags.feature_dashboard && (
              <li><Link href="/account">Customer Portal & Orders</Link></li>
            )}

            <li><Link href="/admin/login">Admin Dashboard</Link></li>
          </ul>
        </div>

        {/* Social Media Column */}
        <div className={styles.column}>
          <h4 className={styles.colTitle}>Connect With Us</h4>
          <ul className={styles.linksList}>
            {socialLinks.map((link) => (
              <li key={link.handle}>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  <svg className={styles.instagramIcon} fill="currentColor" viewBox="0 0 24 24" width="16" height="16">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                  <span className={styles.socialName}>{link.name}:</span>
                  <span className={styles.socialHandle}>{link.handle}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info Column */}
        <div className={styles.column}>
          <h4 className={styles.colTitle}>Head Office</h4>
          <ul className={styles.contactList}>
            <li>
              <span className={styles.contactLabel}>Address:</span>
              <p className={styles.contactValue}>Plot 4 block 11 prince adesoji ajose street ogudu phase 2</p>
            </li>
            <li>
              <span className={styles.contactLabel}>Phone:</span>
              <p className={styles.contactValue}>+234 807 963 5408<br />+234 812 449 1283</p>
            </li>
            <li>
              <span className={styles.contactLabel}>Email:</span>
              <p className={styles.contactValue}>Info@itulahng.com</p>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.bottomContainer}>
          <p className={styles.copyright}>
            &copy; {currentYear} Itulah Nigeria Limited. All rights reserved.
          </p>
          <div className={styles.legalLinks}>
            <Link href="/privacy">Privacy Policy</Link>
            <span className={styles.divider}>|</span>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
