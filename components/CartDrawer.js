'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useFeatures } from '@/context/FeatureContext';
import { useAuth } from '@/context/AuthContext';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
  const router = useRouter();
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, subtotal, totalItemCount } = useCart();
  const { flags } = useFeatures();
  const { user } = useAuth();

  if (!flags.feature_cart || !isCartOpen) return null;

  const handleCheckoutClick = (e) => {
    setIsCartOpen(false);
    if (flags.feature_auth && !user) {
      e.preventDefault();
      router.push('/login?redirect=/checkout');
    }
  };

  return (
    <div className={styles.overlay} onClick={() => setIsCartOpen(false)}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2>Shopping Cart ({totalItemCount})</h2>
          </div>
          <button className={styles.closeBtn} onClick={() => setIsCartOpen(false)} aria-label="Close cart">
            &times;
          </button>
        </div>

        {/* Cart Items */}
        <div className={styles.body}>
          {cart.length === 0 ? (
            <div className={styles.emptyCart}>
              <div className={styles.emptyIcon}>🛒</div>
              <h3>Your cart is empty</h3>
              <p>Explore our beverages, security systems, and lifestyle brands to select items.</p>
              <button className={styles.continueBtn} onClick={() => setIsCartOpen(false)}>
                Browse Products
              </button>
            </div>
          ) : (
            <div className={styles.itemList}>
              {cart.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.itemImageWrapper}>
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={64}
                      height={64}
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <div className={styles.itemInfo}>
                    <h4 className={styles.itemName}>{item.name}</h4>
                    <span className={styles.itemPrice}>
                      {item.price ? `₦${item.price.toLocaleString()}` : 'Price on Quote'}
                    </span>

                    <div className={styles.qtyControls}>
                      <button onClick={() => updateQuantity(item.id, -1)} className={styles.qtyBtn}>-</button>
                      <span className={styles.qtyValue}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className={styles.qtyBtn}>+</button>
                    </div>
                  </div>
                  <div className={styles.itemAction}>
                    <span className={styles.itemTotal}>
                      ₦{((item.price || 0) * item.quantity).toLocaleString()}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className={styles.removeBtn}
                      title="Remove item"
                    >
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Subtotal */}
        {cart.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.subtotalRow}>
              <span>Subtotal</span>
              <span className={styles.subtotalValue}>₦{subtotal.toLocaleString()}</span>
            </div>
            <p className={styles.taxNotice}>Taxes and delivery shipping calculated at checkout.</p>

            {flags.feature_checkout ? (
              <Link
                href="/checkout"
                className={styles.checkoutBtn}
                onClick={handleCheckoutClick}
              >
                Proceed to Checkout
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            ) : (
              <Link
                href="/quote"
                className={styles.checkoutBtn}
                onClick={() => setIsCartOpen(false)}
              >
                Request Quotation for Cart
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
