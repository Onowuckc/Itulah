import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import db from '@/lib/db';
import LogoutButton from '@/components/LogoutButton';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get('admin_session')?.value;

  if (adminSession !== 'active') {
    redirect('/admin/login');
  }

  // Fetch count stats
  let totalProducts = 0;
  let totalBlogs = 0;
  let totalEnquiries = 0;
  let totalOrders = 0;
  let activeFeaturesCount = 0;
  let enquiries = [];

  try {
    totalProducts = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
    totalBlogs = db.prepare('SELECT COUNT(*) as count FROM blogs').get().count;
    totalEnquiries = db.prepare('SELECT COUNT(*) as count FROM enquiries').get().count;
    totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
    activeFeaturesCount = db.prepare('SELECT COUNT(*) as count FROM features WHERE enabled = 1').get().count;
    enquiries = db.prepare('SELECT * FROM enquiries ORDER BY id DESC').all();
  } catch (err) {
    console.error("Database query failed on AdminDashboard mount:", err);
  }

  // Helper to resolve department tag style class
  const getBadgeStyle = (dept) => {
    const d = (dept || '').toLowerCase();
    if (d.includes('beverage') || d.includes('spirits')) {
      return styles.badgeBeverage;
    }
    if (d.includes('cctv') || d.includes('security') || d.includes('locks') || d.includes('fire')) {
      return styles.badgeSecurity;
    }
    return styles.badgeGeneral;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Admin Control Panel</h1>
          <p style={{ color: 'var(--color-text-muted-dark)', marginTop: '4px', fontSize: '14px' }}>
            Itulah Nigeria Limited CMS Manager
          </p>
        </div>
        <Link href="/admin/features" style={{ textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            color: 'white',
            padding: '10px 18px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            ⚡ Feature Expansion Center ({activeFeaturesCount} Active)
          </div>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Products</span>
          <span className={styles.statValue}>{totalProducts}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>News & Articles</span>
          <span className={styles.statValue}>{totalBlogs}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Quotes & Enquiries</span>
          <span className={styles.statValue}>{totalEnquiries}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Customer Orders</span>
          <span className={styles.statValue}>{totalOrders}</span>
        </div>
      </div>

      {/* Received Enquiries Section */}
      <h2 className={styles.sectionTitle}>Inbox: Enquiries & Quotes</h2>
      <div className={styles.inboxWrapper}>
        {enquiries.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: '20%' }}>Sender</th>
                <th style={{ width: '20%' }}>Subject / Department</th>
                <th style={{ width: '45%' }}>Message Requirement</th>
                <th style={{ width: '15%' }}>Date Received</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((enq) => (
                <tr key={enq.id}>
                  <td>
                    <div style={{ fontWeight: '600', color: 'var(--color-text-dark)' }}>{enq.name}</div>
                    <div style={{ color: 'var(--color-text-muted-dark)', fontSize: '13px', marginTop: '2px' }}>{enq.email}</div>
                    {enq.phone && <div style={{ color: 'var(--color-text-muted-dark)', fontSize: '13px' }}>{enq.phone}</div>}
                  </td>
                  <td>
                    <div style={{ fontWeight: '500', marginBottom: '6px' }}>{enq.subject}</div>
                    <span className={`${styles.badge} ${getBadgeStyle(enq.productType)}`}>
                      {enq.productType}
                    </span>
                  </td>
                  <td>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{enq.message}</p>
                    {enq.attachmentUrl && (
                      <a href={enq.attachmentUrl} target="_blank" rel="noopener noreferrer" className={styles.attachmentLink}>
                        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="14" height="14">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                        Download drawing / file
                      </a>
                    )}
                  </td>
                  <td style={{ color: 'var(--color-text-muted-dark)', fontSize: '13px' }}>
                    {enq.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.emptyInbox}>
            <h3>No enquiries found</h3>
            <p style={{ color: 'var(--color-text-muted-dark)', marginTop: '8px' }}>
              Submissions from the Contact and Quote pages will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
