'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function AdminFeaturesPage() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState('');

  const fetchFeatures = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/features');
      const data = await res.json();
      if (data.success) {
        setFeatures(data.features);
      }
    } catch (err) {
      console.error('Error loading admin features:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const handleToggle = async (key, currentStatus) => {
    setSaveMessage('');
    try {
      const res = await fetch('/api/admin/features', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, enabled: !currentStatus })
      });
      const data = await res.json();
      if (data.success) {
        setFeatures(data.features);
        setSaveMessage(`Updated "${key}" status.`);
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (err) {
      console.error('Error toggling feature:', err);
    }
  };

  const handlePreset = async (presetType) => {
    setSaveMessage('');
    try {
      const res = await fetch('/api/admin/features', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preset: presetType })
      });
      const data = await res.json();
      if (data.success) {
        setFeatures(data.features);
        setSaveMessage(presetType === 'all_on' ? 'All expandable features fully activated!' : 'Reset to Handover Mode (Catalog Showcase Only).');
        setTimeout(() => setSaveMessage(''), 4000);
      }
    } catch (err) {
      console.error('Error applying preset:', err);
    }
  };

  const activeCount = features.filter((f) => f.enabled === 1).length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Feature Rollout & Expansion Center</h1>
          <p className={styles.subtitle}>
            Control discretionary customer features. Keep features disabled for initial catalog handover or roll them out with 1-click when expanding.
          </p>
        </div>

        <div className={styles.presetGroup}>
          <button onClick={() => handlePreset('handover')} className={styles.presetHandoverBtn}>
            🔒 Preset: Handover Mode (Catalog Only)
          </button>
          <button onClick={() => handlePreset('all_on')} className={styles.presetAllOnBtn}>
            🚀 Preset: Roll Out All Features
          </button>
        </div>
      </div>

      {saveMessage && <div className={styles.alertSuccess}>{saveMessage}</div>}

      {/* Summary Banner */}
      <div className={styles.statusBanner}>
        <div className={styles.statusStat}>
          <span>Current System Mode:</span>
          <strong className={activeCount === 0 ? styles.modeHandover : styles.modeExpanded}>
            {activeCount === 0 ? 'CLEAN CATALOG HANDOVER MODE' : `FULL EXPANSION (${activeCount} Active Modules)`}
          </strong>
        </div>
        <p className={styles.statusDesc}>
          When a feature is <strong>DISABLED</strong>, it remains hidden on the public site while staying completely functional in code. Turning a switch <strong>ON</strong> immediately deploys that module to your customers.
        </p>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading feature flags...</div>
      ) : (
        <div className={styles.featuresGrid}>
          {features.map((feat) => {
            const isEnabled = feat.enabled === 1;
            return (
              <div key={feat.key} className={`${styles.featureCard} ${isEnabled ? styles.cardActive : ''}`}>
                <div className={styles.cardHeader}>
                  <span className={styles.categoryBadge}>{feat.category}</span>
                  <span className={`${styles.statusBadge} ${isEnabled ? styles.statusActive : styles.statusDisabled}`}>
                    {isEnabled ? '● ACTIVE' : '○ DISABLED'}
                  </span>
                </div>

                <h3 className={styles.cardTitle}>{feat.title}</h3>
                <p className={styles.cardDesc}>{feat.description}</p>
                <div className={styles.keyTag}>Key: <code>{feat.key}</code></div>

                <div className={styles.cardFooter}>
                  <span className={styles.toggleLabel}>
                    {isEnabled ? 'Module Live on Website' : 'Locked for Customer Discretion'}
                  </span>

                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={() => handleToggle(feat.key, isEnabled)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
