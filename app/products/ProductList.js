'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useFeatures } from '@/context/FeatureContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import styles from './ProductList.module.css';

export default function ProductList({ initialProducts }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const catParam = searchParams.get('cat');

  const { flags } = useFeatures();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [products, setProducts] = useState(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle URL category parameters on mount/change
  useEffect(() => {
    if (catParam) {
      setSelectedCategory(catParam);
    } else {
      setSelectedCategory('all');
    }
  }, [catParam]);

  const handleAddToCart = (product) => {
    // If customer auth is enabled and user is not logged in, redirect to login page
    if (flags.feature_auth && !user) {
      router.push('/login?notice=Please+sign+in+or+create+an+account+to+add+items+to+your+cart');
      return;
    }

    addToCart(product);
  };

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'beverages', name: 'Beverages' },
    { id: 'cctv', name: 'CCTV Systems' },
    { id: 'locks', name: 'Physical Security' },
    { id: 'fire', name: 'Fire Safety' },
    { id: 'telephony', name: 'Telephony & PABX' },
    { id: 'fragrance', name: 'Fragrances' },
    { id: 'nutrition', name: 'PULS Nutrition' },
    { id: 'cleaning', name: 'Cleaning Brands' }
  ];

  // Filter products by category and search query
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={styles.container}>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>Our Products & Services</h1>
        <p className={styles.subtitle}>Browse through our premium lifestyle goods and commercial solutions</p>
      </div>

      <div className={styles.toolbar}>
        {/* Search Bar */}
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search products..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Tabs */}
        <div className={styles.filterTabs}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`${styles.tabButton} ${selectedCategory === cat.id ? styles.activeTab : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className={styles.grid}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className={styles.card}>
              <div className={styles.imageWrapper} style={{ padding: '12px' }}>
                {product.featured === 1 && <span className={styles.badge}>Featured</span>}
                <Image
                  src={product.imageUrl || '/img/logo.png'}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 300px"
                  style={{ objectFit: 'contain', padding: '12px' }}
                />
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productDesc}>{product.description}</p>
                
                <div className={styles.cardFooter}>
                  <span className={styles.price}>
                    {product.price ? `₦${product.price.toLocaleString()}` : 'Contact for Quote'}
                  </span>

                  <div className={styles.actionsGroup}>
                    {flags.feature_cart && (
                      <button
                        onClick={() => handleAddToCart(product)}
                        className={styles.addToCartBtn}
                        title="Add to cart"
                      >
                        🛒 Add to Cart
                      </button>
                    )}

                    <Link href={`/quote?product=${encodeURIComponent(product.name)}`} className={styles.quoteLink}>
                      {flags.feature_cart ? 'Quote' : 'Request Quote'}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noResults}>
            <h3>No products found</h3>
            <p>Try refining your search keyword or selecting a different category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
