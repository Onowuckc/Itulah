'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useFeatures } from '@/context/FeatureContext';
import { useCart } from '@/context/CartContext';
import styles from './page.module.css';

export default function CustomerDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout, updateUser } = useAuth();
  const { flags, loading: flagsLoading } = useFeatures();
  const { addToCart } = useCart();

  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    newPassword: ''
  });

  const [profileMessage, setProfileMessage] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Redirect to login if user not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Load user data (orders, wishlist)
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || 'Lagos',
        state: user.state || 'Lagos State',
        newPassword: ''
      });

      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    setLoadingData(true);
    try {
      // Fetch Orders
      const resOrders = await fetch('/api/orders');
      const dataOrders = await resOrders.json();
      if (dataOrders.success) {
        setOrders(dataOrders.orders || []);
      }

      // Fetch Wishlist
      const resWishlist = await fetch('/api/wishlist');
      const dataWishlist = await resWishlist.json();
      if (dataWishlist.success) {
        setWishlist(dataWishlist.wishlist || []);
      }
    } catch (err) {
      console.error('Error loading customer dashboard data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileMessage('');
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm)
      });
      const data = await res.json();
      if (data.success) {
        updateUser(data.user);
        setProfileMessage('Profile and shipping details updated successfully!');
      } else {
        setProfileMessage(data.error || 'Failed to update profile.');
      }
    } catch (err) {
      setProfileMessage('Network error updating profile.');
    }
  };

  const handleRemoveWishlist = async (productId) => {
    try {
      await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });
      fetchUserData();
    } catch (err) {}
  };

  if (flagsLoading || authLoading) {
    return <div className={styles.loadingContainer}>Loading customer portal...</div>;
  }

  if (!flags.feature_auth || !flags.feature_dashboard) {
    return (
      <div className={styles.container}>
        <div className={styles.lockedCard}>
          <div className={styles.lockedIcon}>🔒</div>
          <h2>Customer Dashboard Off</h2>
          <p>Customer portal and account dashboard are currently locked under administrator discretion.</p>
          <Link href="/products" className={styles.btnPrimary}>Return to Showcase</Link>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const inFlightOrders = orders.filter((o) => o.status === 'Pending' || o.status === 'Processing' || o.status === 'Dispatched');

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return styles.badgeDelivered;
      case 'Dispatched':
        return styles.badgeDispatched;
      case 'Processing':
        return styles.badgeProcessing;
      case 'Cancelled':
        return styles.badgeCancelled;
      default:
        return styles.badgePending;
    }
  };

  return (
    <div className={styles.container}>
      {/* Top Banner & User Profile Greeting Header */}
      <div className={styles.userBanner}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className={styles.userDetails}>
            <h1 className={styles.userName}>{user.name}</h1>
            <p className={styles.userEmail}>{user.email} • Customer Portal</p>
          </div>
        </div>
        <button onClick={logout} className={styles.logoutBtn}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>

      {/* Main Layout Grid: Sidebar Tabs + Content */}
      <div className={styles.dashboardLayout}>
        {/* Navigation Sidebar */}
        <aside className={styles.sidebarNav}>
          <button
            className={`${styles.navItem} ${activeTab === 'overview' ? styles.activeNavItem : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview & Metrics
          </button>
          <button
            className={`${styles.navItem} ${activeTab === 'orders' ? styles.activeNavItem : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            📦 My Orders & Tracking ({orders.length})
          </button>
          {flags.feature_wishlist && (
            <button
              className={`${styles.navItem} ${activeTab === 'wishlist' ? styles.activeNavItem : ''}`}
              onClick={() => setActiveTab('wishlist')}
            >
              ❤️ Saved Wishlist ({wishlist.length})
            </button>
          )}
          <button
            className={`${styles.navItem} ${activeTab === 'profile' ? styles.activeNavItem : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            ⚙️ Address & Profile Settings
          </button>
        </aside>

        {/* Tab Main Content */}
        <main className={styles.mainContent}>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className={styles.tabSection}>
              <h2 className={styles.sectionHeader}>Account Dashboard Overview</h2>

              {/* KPI Cards */}
              <div className={styles.kpiGrid}>
                <div className={styles.kpiCard}>
                  <span className={styles.kpiTitle}>Total Orders Placed</span>
                  <span className={styles.kpiValue}>{orders.length}</span>
                </div>
                <div className={styles.kpiCard}>
                  <span className={styles.kpiTitle}>Active Shipments</span>
                  <span className={styles.kpiValue}>{inFlightOrders.length}</span>
                </div>
                <div className={styles.kpiCard}>
                  <span className={styles.kpiTitle}>Saved Wishlist Items</span>
                  <span className={styles.kpiValue}>{wishlist.length}</span>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className={styles.cardBox}>
                <h3 className={styles.boxTitle}>Recent Orders</h3>
                {orders.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>You haven't placed any e-commerce orders yet.</p>
                    <Link href="/products" className={styles.inlineBtn}>Browse Products</Link>
                  </div>
                ) : (
                  <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Order Ref</th>
                          <th>Date</th>
                          <th>Items</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map((order) => (
                          <tr key={order.id}>
                            <td className={styles.refCol}>{order.order_number}</td>
                            <td>{new Date(order.created_at).toLocaleDateString()}</td>
                            <td>{order.items?.length || 1} items</td>
                            <td className={styles.priceCol}>₦{order.total_amount.toLocaleString()}</td>
                            <td>
                              <span className={`${styles.statusBadge} ${getStatusBadge(order.status)}`}>
                                {order.status}
                              </span>
                            </td>
                            <td>
                              <button
                                onClick={() => {
                                  setSelectedOrderDetails(order);
                                  setActiveTab('orders');
                                }}
                                className={styles.tableActionBtn}
                              >
                                View Tracker
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS & TRACKING */}
          {activeTab === 'orders' && (
            <div className={styles.tabSection}>
              <h2 className={styles.sectionHeader}>Order History & Live Progress Tracking</h2>

              {orders.length === 0 ? (
                <div className={styles.cardBox}>
                  <div className={styles.emptyState}>
                    <p>No order history found.</p>
                    <Link href="/products" className={styles.inlineBtn}>Explore Catalog</Link>
                  </div>
                </div>
              ) : (
                <div className={styles.ordersList}>
                  {orders.map((order) => {
                    const currentStep = order.tracking_step || 1;
                    return (
                      <div key={order.id} className={styles.orderCard}>
                        <div className={styles.orderCardHeader}>
                          <div>
                            <span className={styles.orderNumberLabel}>{order.order_number}</span>
                            <span className={styles.orderDateSub}>Placed on {new Date(order.created_at).toLocaleString()}</span>
                          </div>
                          <span className={`${styles.statusBadge} ${getStatusBadge(order.status)}`}>
                            {order.status}
                          </span>
                        </div>

                        {/* Live Tracking Stepper */}
                        <div className={styles.stepperWrapper}>
                          <div className={styles.stepperTrack}>
                            <div
                              className={styles.stepperProgress}
                              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                            />
                          </div>
                          <div className={styles.steps}>
                            <div className={`${styles.stepNode} ${currentStep >= 1 ? styles.stepCompleted : ''}`}>
                              <div className={styles.stepDot}>1</div>
                              <span className={styles.stepName}>Order Placed</span>
                            </div>
                            <div className={`${styles.stepNode} ${currentStep >= 2 ? styles.stepCompleted : ''}`}>
                              <div className={styles.stepDot}>2</div>
                              <span className={styles.stepName}>Processing</span>
                            </div>
                            <div className={`${styles.stepNode} ${currentStep >= 3 ? styles.stepCompleted : ''}`}>
                              <div className={styles.stepDot}>3</div>
                              <span className={styles.stepName}>Dispatched</span>
                            </div>
                            <div className={`${styles.stepNode} ${currentStep >= 4 ? styles.stepCompleted : ''}`}>
                              <div className={styles.stepDot}>4</div>
                              <span className={styles.stepName}>Delivered</span>
                            </div>
                          </div>
                        </div>

                        {/* Items breakdown */}
                        <div className={styles.orderItemsBreakdown}>
                          <h4 style={{ color: '#ffffff', marginBottom: '12px', fontSize: '14px' }}>Items Purchased:</h4>
                          {order.items?.map((item, idx) => (
                            <div key={idx} className={styles.orderItemRow}>
                              <div className={styles.orderItemThumb}>
                                <Image src={item.imageUrl || '/img/logo.png'} alt={item.name} width={40} height={40} style={{ objectFit: 'contain' }} />
                              </div>
                              <div className={styles.orderItemMeta}>
                                <span className={styles.orderItemTitle}>{item.name}</span>
                                <span className={styles.orderItemQtyPrice}>Qty: {item.quantity} × ₦{(item.price || 0).toLocaleString()}</span>
                              </div>
                              <span className={styles.orderItemSubtotal}>
                                ₦{((item.price || 0) * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className={styles.orderCardFooter}>
                          <div>
                            <span style={{ color: '#94a3b8', fontSize: '13px' }}>Delivery Address: </span>
                            <span style={{ color: '#cbd5e1', fontSize: '13px', fontWeight: '600' }}>
                              {order.shipping_address}, {order.city}, {order.state}
                            </span>
                          </div>
                          <div className={styles.totalPriceLabel}>
                            Total: <span>₦{order.total_amount.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WISHLIST */}
          {activeTab === 'wishlist' && flags.feature_wishlist && (
            <div className={styles.tabSection}>
              <h2 className={styles.sectionHeader}>Saved Products & Wishlist</h2>

              {wishlist.length === 0 ? (
                <div className={styles.cardBox}>
                  <div className={styles.emptyState}>
                    <p>Your wishlist is currently empty.</p>
                    <Link href="/products" className={styles.inlineBtn}>Browse Catalog</Link>
                  </div>
                </div>
              ) : (
                <div className={styles.wishlistGrid}>
                  {wishlist.map((item) => (
                    <div key={item.wishlist_id} className={styles.wishCard}>
                      <div className={styles.wishImage}>
                        <Image src={item.imageUrl || '/img/logo.png'} alt={item.name} fill style={{ objectFit: 'contain', padding: '8px' }} />
                      </div>
                      <div className={styles.wishBody}>
                        <h4>{item.name}</h4>
                        <span className={styles.wishPrice}>₦{(item.price || 0).toLocaleString()}</span>
                        <div className={styles.wishActions}>
                          <button
                            onClick={() => {
                              addToCart(item);
                              handleRemoveWishlist(item.id);
                            }}
                            className={styles.addToCartWishBtn}
                          >
                            Move to Cart
                          </button>
                          <button onClick={() => handleRemoveWishlist(item.id)} className={styles.removeWishBtn}>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PROFILE & ADDRESS */}
          {activeTab === 'profile' && (
            <div className={styles.tabSection}>
              <h2 className={styles.sectionHeader}>Customer Account & Primary Address Settings</h2>

              <div className={styles.cardBox}>
                {profileMessage && <div className={styles.msgAlert}>{profileMessage}</div>}

                <form onSubmit={handleProfileSave} className={styles.profileForm}>
                  <div className={styles.inputGrid}>
                    <div className={styles.field}>
                      <label>Full Name</label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className={styles.field}>
                      <label>Email Address (Account ID)</label>
                      <input type="email" value={user.email} disabled className={styles.disabledInput} />
                    </div>
                  </div>

                  <div className={styles.inputGrid}>
                    <div className={styles.field}>
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        placeholder="+234 803 000 0000"
                      />
                    </div>
                    <div className={styles.field}>
                      <label>State / Region</label>
                      <input
                        type="text"
                        value={profileForm.state}
                        onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label>Default Shipping Address</label>
                    <textarea
                      rows={3}
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                      placeholder="Street address, landmarks..."
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Change Password (Leave blank to keep current)</label>
                    <input
                      type="password"
                      value={profileForm.newPassword}
                      onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })}
                      placeholder="New password"
                    />
                  </div>

                  <button type="submit" className={styles.saveBtn}>
                    Save Account Changes
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
