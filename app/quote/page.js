import { Suspense } from 'react';
import QuoteForm from './QuoteForm';
import styles from './page.module.css';

export const metadata = {
  title: "Request a Quote | Itulah Nigeria Limited",
  description: "Request a customized pricing quote for Itulah Nigeria Limited products: CCTV camera grid designs, Abus hardware lock orders, fine fragrances supplies, or bulk beverages.",
};

export default function QuotePage() {
  return (
    <div className={styles.container}>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>Request a Quote / Enquiry</h1>
        <p className={styles.subtitle}>Submit your drawings, floorplans, or specifications for a detailed assessment</p>
      </div>

      <Suspense fallback={<div style={{ padding: '40px 0', textAlign: 'center', color: '#94a3b8' }}>Loading form elements...</div>}>
        <QuoteForm />
      </Suspense>
    </div>
  );
}
