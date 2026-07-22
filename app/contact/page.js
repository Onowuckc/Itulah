'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          productType: 'General Enquiry'
        })
      });

      const data = await res.json();
      if (res.ok) {
        setStatus({
          type: 'success',
          message: 'Thank you! Your message has been sent successfully. We will get back to you shortly.'
        });
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setStatus({
          type: 'error',
          message: data.error || 'Something went wrong. Please try again.'
        });
      }
    } catch (err) {
      console.error(err);
      setStatus({
        type: 'error',
        message: 'Could not connect to the server. Please check your connection and try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>Contact Us</h1>
        <p className={styles.subtitle}>Get in touch with our team. We're ready to assist you.</p>
      </div>

      <div className={styles.grid}>
        {/* Contact Info */}
        <div className={styles.infoSection}>
          <div className={styles.infoBlock}>
            <h3 className={styles.blockTitle}>
              <svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              Office Address
            </h3>
            <div className={styles.blockText}>
              <p>Plot 4 block 11 prince adesoji ajose street,</p>
              <p>Ogudu phase 2, Lagos, Nigeria.</p>
            </div>
          </div>

          <div className={styles.infoBlock}>
            <h3 className={styles.blockTitle}>
              <svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              Phone Numbers
            </h3>
            <div className={styles.blockText}>
              <p>+234 807 963 5408</p>
              <p>+234 812 449 1283</p>
            </div>
          </div>

          <div className={styles.infoBlock}>
            <h3 className={styles.blockTitle}>
              <svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              Email Address
            </h3>
            <div className={styles.blockText}>
              <p>Info@itulahng.com</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className={styles.formBlock}>
          <form onSubmit={handleSubmit}>
            {status.type === 'success' && (
              <div className={styles.successMessage}>{status.message}</div>
            )}
            {status.type === 'error' && (
              <div className={styles.errorMessage}>{status.message}</div>
            )}

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={styles.input}
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="email">Your Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={styles.input}
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className={styles.input}
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className={styles.input}
                  required
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                className={styles.textarea}
                required
                value={formData.message}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Sending Message...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>

      {/* Google Map Section */}
      <div className={styles.mapBlock}>
        <iframe
          src="https://maps.google.com/maps?q=Prince%20Adesoji%20Ajose%20Street%2C%20Ogudu%20Phase%202%2C%20Lagos%2C%20Nigeria&t=&z=16&ie=UTF8&iwloc=&output=embed"
          className={styles.mapFrame}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Itulah Nigeria Limited Office Location - Ogudu Phase 2"
        />
      </div>
    </div>
  );
}
