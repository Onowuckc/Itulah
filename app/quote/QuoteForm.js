'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';

export default function QuoteForm() {
  const searchParams = useSearchParams();
  const initialProduct = searchParams.get('product');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    productType: 'Beverages & Spirits',
    subject: '',
    message: ''
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  // Update subject if product parameter is passed from product listing
  useEffect(() => {
    if (initialProduct) {
      setFormData((prev) => ({
        ...prev,
        productType: getProductCategory(initialProduct),
        subject: `Enquiry about: ${initialProduct}`,
        message: `Hello, I would like to request a quote / detailed information regarding: ${initialProduct}.`
      }));
    }
  }, [initialProduct]);

  // Helper to map product title to category option
  const getProductCategory = (prodName) => {
    const name = prodName.toLowerCase();
    if (name.includes('octopus') || name.includes('liqueur') || name.includes('whiskey') || name.includes('gin') || name.includes('beverage')) {
      return 'Beverages & Spirits';
    }
    if (name.includes('fragrance') || name.includes('spray') || name.includes('perfume') || name.includes('frais') || name.includes('wendie') || name.includes('aroma')) {
      return 'Fragrances & Personal Care';
    }
    if (name.includes('puls') || name.includes('supplement') || name.includes('shaker') || name.includes('water bottle') || name.includes('nutrition')) {
      return 'PULS Nutrition';
    }
    if (name.includes('zykon') || name.includes('diversey') || name.includes('cleaning') || name.includes('detergent')) {
      return 'Cleaning & Industrial Solutions';
    }
    return 'General Enquiry';
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('productType', formData.productType);
      data.append('subject', formData.subject);
      data.append('message', formData.message);
      if (file) {
        data.append('file', file);
      }

      const res = await fetch('/api/enquiry', {
        method: 'POST',
        body: data // Use multi-part form data to upload the attachment file
      });

      const result = await res.json();
      if (res.ok) {
        setStatus({
          type: 'success',
          message: 'Thank you! Your quote request / enquiry has been submitted. We will review your requirements and respond shortly.'
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          productType: 'Beverages & Spirits',
          subject: '',
          message: ''
        });
        setFile(null);
      } else {
        setStatus({
          type: 'error',
          message: result.error || 'Failed to submit quote. Please try again.'
        });
      }
    } catch (err) {
      console.error(err);
      setStatus({
        type: 'error',
        message: 'Could not connect to the server. Please verify your connection.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
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
            <label className={styles.label} htmlFor="name">Your Name / Company</label>
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
            <label className={styles.label} htmlFor="email">Email Address</label>
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
              required
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="productType">Interest Department</label>
            <select
              id="productType"
              name="productType"
              className={styles.select}
              value={formData.productType}
              onChange={handleChange}
            >
              <option value="Beverages & Spirits">Beverages & Spirits</option>
              <option value="Fragrances & Personal Care">Fragrances & Personal Care</option>
              <option value="PULS Nutrition">PULS Nutrition</option>
              <option value="General Enquiry">General Enquiry</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="subject">Subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            className={styles.input}
            required
            placeholder="e.g. Bulk Wild Octopus Liqueur order"
            value={formData.subject}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="message">Requirement Details / Enquiry Message</label>
          <textarea
            id="message"
            name="message"
            className={styles.textarea}
            required
            placeholder="Please detail your project specifications, quantity needed, or context..."
            value={formData.message}
            onChange={handleChange}
          />
        </div>

        {/* File Attachment Upload */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Upload Technical Drawings / Documents (Optional)</label>
          <div className={styles.fileInputWrapper}>
            <span className={styles.uploadIcon}>
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="28" height="28" style={{ margin: '0 auto' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
              </svg>
            </span>
            <p className={styles.uploadText}>
              Click to select drawing, floor plan or PDF list
            </p>
            <input
              type="file"
              name="file"
              className={styles.hiddenFileInput}
              onChange={handleFileChange}
              accept=".pdf,.png,.jpg,.jpeg,.dwg,.doc,.docx"
            />
            {file && <div className={styles.fileName}>Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</div>}
          </div>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Submitting Quote Request...' : 'Submit Quote Request'}
        </button>
      </form>
    </div>
  );
}
