'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './ProductsManager.module.css';

export default function ProductsManager({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'beverages',
    description: '',
    price: '',
    imageUrl: '/img/logo.png',
    featured: false
  });

  const [alert, setAlert] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const processImageFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, JPEG, WEBP, etc.)');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_SIZE = 800;
        
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.82);
        setFormData(prev => ({ ...prev, imageUrl: compressedBase64 }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const categories = [
    { id: 'beverages', name: 'Beverages' },
    { id: 'cctv', name: 'CCTV Systems' },
    { id: 'locks', name: 'Physical Security' },
    { id: 'fire', name: 'Fire Safety' },
    { id: 'telephony', name: 'Telephony & PABX' },
    { id: 'fragrance', name: 'Fragrances' },
    { id: 'nutrition', name: 'PULS Nutrition' },
    { id: 'cleaning', name: 'Cleaning Brands' }
  ];

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description || '',
      price: product.price ? product.price.toString() : '',
      imageUrl: product.imageUrl || '/img/logo.png',
      featured: product.featured === 1
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      category: 'beverages',
      description: '',
      price: '',
      imageUrl: '/img/logo.png',
      featured: false
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ type: '', message: '' });

    const endpoint = '/api/admin/products';
    const method = editingId ? 'PUT' : 'POST';
    const payload = editingId ? { ...formData, id: editingId } : formData;

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        setAlert({
          type: 'success',
          message: editingId ? 'Product updated successfully.' : 'Product added successfully.'
        });

        // Refresh list
        if (editingId) {
          setProducts(products.map((p) => (p.id === editingId ? { ...p, ...formData, featured: formData.featured ? 1 : 0, price: formData.price ? parseFloat(formData.price) : null } : p)));
        } else {
          setProducts([
            ...products,
            { ...formData, id: data.id, featured: formData.featured ? 1 : 0, price: formData.price ? parseFloat(formData.price) : null }
          ]);
        }

        handleCancelEdit();
      } else {
        setAlert({ type: 'error', message: data.error || 'Failed to save product.' });
      }
    } catch (err) {
      console.error(err);
      setAlert({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    setAlert({ type: '', message: '' });
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setAlert({ type: 'success', message: 'Product deleted successfully.' });
        setProducts(products.filter((p) => p.id !== id));
      } else {
        const data = await res.json();
        setAlert({ type: 'error', message: data.error || 'Failed to delete product.' });
      }
    } catch (err) {
      console.error(err);
      setAlert({ type: 'error', message: 'Network error.' });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Manage Products</h1>
          <p style={{ color: 'var(--color-text-muted-dark)', marginTop: '4px', fontSize: '14px' }}>
            Add, update, or remove items from Itulah public catalog
          </p>
        </div>
      </div>

      {alert.message && (
        <div className={alert.type === 'success' ? styles.successAlert : styles.errorAlert}>
          {alert.message}
        </div>
      )}

      <div className={styles.managerGrid}>
        {/* Product Form */}
        <div className={styles.formBlock}>
          <h3 className={styles.formTitle}>
            {editingId ? 'Edit Product' : 'Add New Product'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Product Name</label>
              <input
                type="text"
                name="name"
                className={styles.input}
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Abus combination padlock diskus"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Category</label>
              <select
                name="category"
                className={styles.select}
                value={formData.category}
                onChange={handleInputChange}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Price (₦, Optional)</label>
              <input
                type="number"
                name="price"
                className={styles.input}
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g. 15000"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Product Image</label>
              <div 
                className={`${styles.uploadZone} ${dragOver ? styles.uploadZoneDragOver : ''} ${formData.imageUrl ? styles.uploadZoneWithImage : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="product-image-upload"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className={styles.fileInput}
                  style={{ display: 'none' }}
                />
                <label htmlFor="product-image-upload" className={styles.uploadLabel}>
                  {formData.imageUrl ? (
                    <div className={styles.previewContainer}>
                      <div className={styles.previewImageWrapper}>
                        <Image
                          src={formData.imageUrl}
                          alt="Product Preview"
                          fill
                          sizes="150px"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className={styles.previewOverlay}>
                        <span>Change Image</span>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.uploadPrompt}>
                      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Drag & drop image here or click to browse</span>
                      <span className={styles.uploadSubtext}>JPG, PNG, WEBP (Autocompressed)</span>
                    </div>
                  )}
                </label>
              </div>
              
              <div className={styles.manualUrlContainer}>
                <details className={styles.manualUrlDetails}>
                  <summary className={styles.manualUrlSummary}>Or enter manual image path/URL</summary>
                  <input
                    type="text"
                    name="imageUrl"
                    className={styles.input}
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="e.g. /img/cctv.png"
                    style={{ marginTop: '8px', width: '100%' }}
                  />
                </details>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Description</label>
              <textarea
                name="description"
                className={styles.textarea}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Technical features, brand dimensions, or specifications..."
                rows="4"
              />
            </div>

            <div className={`${styles.formGroup} ${styles.checkboxGroup}`}>
              <input
                type="checkbox"
                name="featured"
                id="featured"
                className={styles.checkbox}
                checked={formData.featured}
                onChange={handleInputChange}
              />
              <label className={styles.label} htmlFor="featured" style={{ marginBottom: 0, cursor: 'pointer' }}>
                Feature on Homepage Banners
              </label>
            </div>

            <div className={styles.btnRow}>
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Saving...' : editingId ? 'Update Item' : 'Add Product'}
              </button>
              {editingId && (
                <button type="button" className={styles.cancelBtn} onClick={handleCancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Products List Table */}
        <div className={styles.listBlock}>
          <h3 className={styles.formTitle}>Current Catalog ({products.length})</h3>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: '10%' }}>Image</th>
                  <th style={{ width: '45%' }}>Name</th>
                  <th style={{ width: '20%' }}>Category</th>
                  <th style={{ width: '25%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div style={{ position: 'relative', width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', backgroundColor: 'rgba(255, 255, 255, 0.45)' }}>
                        <Image
                          src={product.imageUrl || '/img/logo.png'}
                          alt=""
                          fill
                          sizes="40px"
                          style={{ objectFit: 'contain', padding: '2px' }}
                        />
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600', color: 'var(--color-text-dark)' }}>{product.name}</div>
                      {product.price && <div style={{ fontSize: '12px', color: 'var(--color-accent)', marginTop: '2px' }}>₦{product.price.toLocaleString()}</div>}
                    </td>
                    <td style={{ textTransform: 'capitalize', color: 'var(--color-text-muted-dark)' }}>
                      {product.category}
                    </td>
                    <td>
                      <button className={styles.editBtn} onClick={() => handleEditClick(product)}>
                        Edit
                      </button>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(product.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
