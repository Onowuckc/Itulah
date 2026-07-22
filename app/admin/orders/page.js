'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const getBadgeStyle = (status) => {
    switch (status) {
      case 'Delivered': return styles.badgeDelivered;
      case 'Dispatched': return styles.badgeDispatched;
      case 'Processing': return styles.badgeProcessing;
      case 'Cancelled': return styles.badgeCancelled;
      default: return styles.badgePending;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Customer Orders Fulfillment</h1>
        <p className={styles.subtitle}>
          Manage customer purchases, update live order tracking steps, and view transaction details.
        </p>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading customer orders...</div>
      ) : orders.length === 0 ? (
        <div className={styles.emptyCard}>
          <h3>No Orders Received Yet</h3>
          <p>When customers complete checkout, their orders will appear here for fulfillment.</p>
        </div>
      ) : (
        <div className={styles.ordersList}>
          {orders.map((order) => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.cardHeader}>
                <div>
                  <span className={styles.orderNumber}>{order.order_number}</span>
                  <span className={styles.orderDate}>
                    Placed on {new Date(order.created_at).toLocaleString()}
                  </span>
                </div>

                <div className={styles.statusGroup}>
                  <span className={`${styles.statusBadge} ${getBadgeStyle(order.status)}`}>
                    {order.status}
                  </span>

                  <select
                    value={order.status}
                    disabled={updatingId === order.id}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={styles.statusSelect}
                  >
                    <option value="Pending">Step 1: Pending</option>
                    <option value="Processing">Step 2: Processing</option>
                    <option value="Dispatched">Step 3: Dispatched</option>
                    <option value="Delivered">Step 4: Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Customer & Shipping Details */}
              <div className={styles.detailsGrid}>
                <div className={styles.detailCol}>
                  <span className={styles.label}>Customer Details:</span>
                  <strong>{order.customer_name}</strong>
                  <span>{order.customer_email}</span>
                  <span>{order.customer_phone}</span>
                </div>

                <div className={styles.detailCol}>
                  <span className={styles.label}>Shipping Address:</span>
                  <span>{order.shipping_address}</span>
                  <span>{order.city}, {order.state}</span>
                </div>

                <div className={styles.detailCol}>
                  <span className={styles.label}>Payment & Total:</span>
                  <span className={styles.paymentMethod}>Mode: {order.payment_method}</span>
                  <span className={styles.totalPrice}>₦{order.total_amount.toLocaleString()}</span>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className={styles.itemsTable}>
                <h4 className={styles.itemsHeader}>Items Breakdown:</h4>
                <div className={styles.itemsGrid}>
                  {order.items?.map((item, idx) => (
                    <div key={idx} className={styles.itemRow}>
                      <div className={styles.itemThumb}>
                        <Image src={item.imageUrl || '/img/logo.png'} alt={item.name} width={36} height={36} style={{ objectFit: 'contain' }} />
                      </div>
                      <div className={styles.itemNameInfo}>
                        <span className={styles.itemName}>{item.name}</span>
                        <span className={styles.itemQty}>Qty: {item.quantity} × ₦{(item.price || 0).toLocaleString()}</span>
                      </div>
                      <span className={styles.itemTotal}>₦{((item.price || 0) * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
