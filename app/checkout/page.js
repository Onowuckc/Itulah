'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useFeatures } from '@/context/FeatureContext';
import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, clearCart } = useCart();
  const { flags, loading: flagsLoading } = useFeatures();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'Lagos',
    state: 'Lagos State',
    paymentMethod: 'Card',
    cardNumber: '4111 2222 3333 4444',
    cardExp: '12/28',
    cardCvv: '888'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-fill from user profile if logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        address: user.address || prev.address,
        city: user.city || prev.city,
        state: user.state || prev.state
      }));
    }
  }, [user]);

  const deliveryFee = 3500;
  const grandTotal = subtotal + deliveryFee;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (cart.length === 0) {
      setErrorMsg('Your shopping cart is empty.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          shipping_address: formData.address,
          city: formData.city,
          state: formData.state,
          payment_method: formData.paymentMethod
        })
      });

      const data = await res.json();

      if (data.success) {
        setCompletedOrder({
          ...data.order,
          items: [...cart],
          grandTotal,
          deliveryFee,
          address: formData.address,
          city: formData.city,
          state: formData.state
        });
        clearCart();
      } else {
        setErrorMsg(data.error || 'Failed to process order. Please try again.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMsg('An unexpected error occurred during checkout.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (flagsLoading) {
    return <div className={styles.loadingContainer}>Checking checkout availability...</div>;
  }

  // If feature_checkout is disabled, notify and redirect
  if (!flags.feature_checkout) {
    return (
      <div className={styles.disabledContainer}>
        <div className={styles.disabledCard}>
          <div className={styles.disabledIcon}>🔒</div>
          <h2>E-Commerce Checkout Not Active</h2>
          <p>Online checkout is currently locked by the administrator. Please submit a direct quote request for your items.</p>
          <Link href="/quote" className={styles.quoteRedirectBtn}>
            Proceed to Quote Request
          </Link>
        </div>
      </div>
    );
  }

  // Order Confirmation Success Screen
  if (completedOrder) {
    return (
      <div className={styles.container}>
        <div className={styles.successCard}>
          <div className={styles.successBadge}>
            <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className={styles.successTitle}>Order Confirmed!</h1>
          <p className={styles.successSub}>
            Thank you for your order, <strong>{completedOrder.customer_name}</strong>. We have sent a confirmation email to <strong>{completedOrder.customer_email}</strong>.
          </p>

          <div className={styles.orderRefBox}>
            <span>Order Reference Number</span>
            <span className={styles.refCode}>{completedOrder.order_number}</span>
          </div>

          <div className={styles.invoiceSummary}>
            <div className={styles.summaryRow}>
              <span>Items Subtotal:</span>
              <span>₦{completedOrder.items.reduce((s, i) => s + (i.price * i.quantity), 0).toLocaleString()}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Delivery Fee (Lagos/Regional Express):</span>
              <span>₦{deliveryFee.toLocaleString()}</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span>Total Paid / Payable:</span>
              <span>₦{completedOrder.grandTotal.toLocaleString()}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Payment Mode:</span>
              <span className={styles.paymentMethodTag}>{completedOrder.payment_method}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Delivery Destination:</span>
              <span>{completedOrder.address}, {completedOrder.city}, {completedOrder.state}</span>
            </div>
          </div>

          <div className={styles.actionButtons}>
            {flags.feature_dashboard && (
              <Link href="/account" className={styles.primaryBtn}>
                Track Order in Customer Portal
              </Link>
            )}
            <Link href="/products" className={styles.secondaryBtn}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Complete Your Order</h1>
        <p className={styles.subtitle}>Enter delivery details and select payment method to finalize your purchase</p>
      </div>

      {errorMsg && <div className={styles.errorAlert}>{errorMsg}</div>}

      <div className={styles.checkoutGrid}>
        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className={styles.formSection}>
          <div className={styles.formGroupCard}>
            <h2>1. Contact & Shipping Information</h2>

            <div className={styles.inputGrid}>
              <div className={styles.inputField}>
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Adebayo Okonjo"
                />
              </div>

              <div className={styles.inputField}>
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. adebayo@example.com"
                />
              </div>
            </div>

            <div className={styles.inputGrid}>
              <div className={styles.inputField}>
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+234 803 000 0000"
                />
              </div>

              <div className={styles.inputField}>
                <label>State / Region *</label>
                <select name="state" value={formData.state} onChange={handleChange}>
                  <option value="Lagos State">Lagos State</option>
                  <option value="Abuja FCT">Abuja FCT</option>
                  <option value="Rivers State">Rivers State</option>
                  <option value="Oyo State">Oyo State</option>
                  <option value="Other States">Other States in Nigeria</option>
                </select>
              </div>
            </div>

            <div className={styles.inputField} style={{ marginTop: '16px' }}>
              <label>Delivery Address *</label>
              <textarea
                name="address"
                required
                rows={3}
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address, building name, apartment suite, land marks..."
              />
            </div>
          </div>

          <div className={styles.formGroupCard} style={{ marginTop: '24px' }}>
            <h2>2. Payment Selection</h2>

            <div className={styles.paymentOptions}>
              <label className={`${styles.paymentOptionCard} ${formData.paymentMethod === 'Card' ? styles.selectedPayment : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Card"
                  checked={formData.paymentMethod === 'Card'}
                  onChange={handleChange}
                />
                <div className={styles.paymentInfo}>
                  <span className={styles.paymentTitle}>💳 Credit / Debit Card (Instant Gateway)</span>
                  <span className={styles.paymentSub}>Pay securely with Mastercard, Visa, Verve</span>
                </div>
              </label>

              <label className={`${styles.paymentOptionCard} ${formData.paymentMethod === 'Bank Transfer' ? styles.selectedPayment : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Bank Transfer"
                  checked={formData.paymentMethod === 'Bank Transfer'}
                  onChange={handleChange}
                />
                <div className={styles.paymentInfo}>
                  <span className={styles.paymentTitle}>🏦 Bank Transfer</span>
                  <span className={styles.paymentSub}>Direct transfer to Itulah Nigeria Ltd Guaranty Trust Bank</span>
                </div>
              </label>

              <label className={`${styles.paymentOptionCard} ${formData.paymentMethod === 'Pay on Delivery' ? styles.selectedPayment : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Pay on Delivery"
                  checked={formData.paymentMethod === 'Pay on Delivery'}
                  onChange={handleChange}
                />
                <div className={styles.paymentInfo}>
                  <span className={styles.paymentTitle}>📦 Pay on Delivery</span>
                  <span className={styles.paymentSub}>Available for Lagos Metro delivery locations</span>
                </div>
              </label>
            </div>

            {/* Bank Transfer Instructions preview */}
            {formData.paymentMethod === 'Bank Transfer' && (
              <div className={styles.bankBox}>
                <p style={{ fontWeight: '600', marginBottom: '4px' }}>Bank Transfer Details:</p>
                <p>Bank: Guaranty Trust Bank (GTB)</p>
                <p>Account Name: Itulah Nigeria Limited</p>
                <p>Account Number: 0123456789</p>
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  Use your order number as payment reference upon order placement.
                </p>
              </div>
            )}

            {/* Card Simulator Fields */}
            {formData.paymentMethod === 'Card' && (
              <div className={styles.cardSimulator}>
                <div className={styles.inputField}>
                  <label>Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.inputGrid} style={{ marginTop: '12px' }}>
                  <div className={styles.inputField}>
                    <label>Expiry Date</label>
                    <input type="text" name="cardExp" value={formData.cardExp} onChange={handleChange} />
                  </div>
                  <div className={styles.inputField}>
                    <label>CVV Security Code</label>
                    <input type="text" name="cardCvv" value={formData.cardCvv} onChange={handleChange} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || cart.length === 0}
            className={styles.submitOrderBtn}
          >
            {isSubmitting ? 'Processing Order...' : `Confirm & Pay ₦${grandTotal.toLocaleString()}`}
          </button>
        </form>

        {/* Order Summary Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.summaryCard}>
            <h3 className={styles.summaryHeader}>Order Summary ({cart.length} items)</h3>

            <div className={styles.summaryItemList}>
              {cart.map((item) => (
                <div key={item.id} className={styles.summaryItem}>
                  <div className={styles.summaryThumb}>
                    <Image src={item.imageUrl} alt={item.name} width={48} height={48} style={{ objectFit: 'contain' }} />
                    <span className={styles.summaryItemQty}>{item.quantity}</span>
                  </div>
                  <div className={styles.summaryItemDetails}>
                    <div className={styles.summaryItemName}>{item.name}</div>
                    <div className={styles.summaryItemPrice}>₦{(item.price || 0).toLocaleString()} each</div>
                  </div>
                  <div className={styles.summaryItemTotal}>
                    ₦{((item.price || 0) * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.calculationSection}>
              <div className={styles.calcRow}>
                <span>Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div className={styles.calcRow}>
                <span>Estimated Shipping</span>
                <span>₦{deliveryFee.toLocaleString()}</span>
              </div>
              <div className={`${styles.calcRow} ${styles.grandTotalRow}`}>
                <span>Total Amount</span>
                <span className={styles.grandTotalValue}>₦{grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
