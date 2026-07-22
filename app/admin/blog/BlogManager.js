'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './BlogManager.module.css';

export default function BlogManager({ initialBlogs }) {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'News',
    author: 'Itulah Admin',
    imageUrl: '/img/logo.png',
    content: ''
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

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditClick = (post) => {
    setEditingId(post.id);
    setFormData({
      title: post.title,
      category: post.category || 'News',
      author: post.author || 'Itulah Admin',
      imageUrl: post.imageUrl || '/img/logo.png',
      content: post.content || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      title: '',
      category: 'News',
      author: 'Itulah Admin',
      imageUrl: '/img/logo.png',
      content: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ type: '', message: '' });

    const endpoint = '/api/admin/blogs';
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
          message: editingId ? 'Article updated successfully.' : 'Article published successfully.'
        });

        // Refresh list
        if (editingId) {
          setBlogs(blogs.map((b) => (b.id === editingId ? { ...b, ...formData } : b)));
        } else {
          setBlogs([
            { ...formData, id: data.id, slug: data.slug, date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
            ...blogs
          ]);
        }

        handleCancelEdit();
      } else {
        setAlert({ type: 'error', message: data.error || 'Failed to save article.' });
      }
    } catch (err) {
      console.error(err);
      setAlert({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    
    setAlert({ type: '', message: '' });
    try {
      const res = await fetch(`/api/admin/blogs?id=${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setAlert({ type: 'success', message: 'Article deleted successfully.' });
        setBlogs(blogs.filter((b) => b.id !== id));
      } else {
        const data = await res.json();
        setAlert({ type: 'error', message: data.error || 'Failed to delete article.' });
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
          <h1 className={styles.title}>Manage Blog & News</h1>
          <p style={{ color: 'var(--color-text-muted-dark)', marginTop: '4px', fontSize: '14px' }}>
            Write and release articles, product news, or security installation guides
          </p>
        </div>
      </div>

      {alert.message && (
        <div className={alert.type === 'success' ? styles.successAlert : styles.errorAlert}>
          {alert.message}
        </div>
      )}

      <div className={styles.managerGrid}>
        {/* Blog Form */}
        <div className={styles.formBlock}>
          <h3 className={styles.formTitle}>
            {editingId ? 'Edit Article' : 'Write New Article'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Article Title</label>
              <input
                type="text"
                name="title"
                className={styles.input}
                required
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. 5 Tips on Home Security Camera Setup"
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
                <option value="News">Company News</option>
                <option value="Security">Security Guides</option>
                <option value="Beverages">Beverages & Spirits</option>
                <option value="Fragrance">Fragrances & Flavors</option>
                <option value="Nutrition">PULS Nutrition</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Author Name</label>
              <input
                type="text"
                name="author"
                className={styles.input}
                required
                value={formData.author}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Article Header Image</label>
              <div 
                className={`${styles.uploadZone} ${dragOver ? styles.uploadZoneDragOver : ''} ${formData.imageUrl ? styles.uploadZoneWithImage : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="blog-image-upload"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className={styles.fileInput}
                  style={{ display: 'none' }}
                />
                <label htmlFor="blog-image-upload" className={styles.uploadLabel}>
                  {formData.imageUrl ? (
                    <div className={styles.previewContainer}>
                      <div className={styles.previewImageWrapper}>
                        <Image
                          src={formData.imageUrl}
                          alt="Article Preview"
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
              <label className={styles.label}>Content (HTML or Text)</label>
              <textarea
                name="content"
                className={styles.textarea}
                required
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Write full article here. Supports HTML like <p>, <h3>, <ul>..."
                rows="10"
              />
            </div>

            <div className={styles.btnRow}>
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Publishing...' : editingId ? 'Update Post' : 'Publish Article'}
              </button>
              {editingId && (
                <button type="button" className={styles.cancelBtn} onClick={handleCancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Blogs List Table */}
        <div className={styles.listBlock}>
          <h3 className={styles.formTitle}>Published Articles ({blogs.length})</h3>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: '10%' }}>Image</th>
                  <th style={{ width: '55%' }}>Title</th>
                  <th style={{ width: '15%' }}>Date</th>
                  <th style={{ width: '20%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((post) => (
                  <tr key={post.id}>
                    <td>
                      <div style={{ position: 'relative', width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', backgroundColor: 'rgba(255, 255, 255, 0.45)' }}>
                        <Image
                          src={post.imageUrl || '/img/logo.png'}
                          alt=""
                          fill
                          sizes="40px"
                          style={{ objectFit: 'contain', padding: '2px' }}
                        />
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600', color: 'var(--color-text-dark)' }}>{post.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-muted-dark)', marginTop: '2px' }}>{post.category}</div>
                    </td>
                    <td style={{ color: 'var(--color-text-muted-dark)', fontSize: '13px' }}>
                      {post.date}
                    </td>
                    <td>
                      <button className={styles.editBtn} onClick={() => handleEditClick(post)}>
                        Edit
                      </button>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(post.id)}>
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
