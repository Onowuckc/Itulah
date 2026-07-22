'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useFeatures } from '@/context/FeatureContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import styles from './Header.module.css';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const { flags } = useFeatures();
  const { totalItemCount, setIsCartOpen } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Products & Services', path: '/products' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Blog & News', path: '/blog' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logoLink} onClick={() => setIsOpen(false)}>
          <div className={styles.logoContainer}>
            <Image
              src="/img/logo.png"
              alt="Itulah Nigeria Limited"
              width={150}
              height={45}
              className={styles.logoImage}
              priority
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <span className={styles.logoFallback}>ITULAH</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`${styles.navLink} ${isActive ? styles.active : ''}`}
              >
                {link.name}
              </Link>
            );
          })}

          {/* Conditional Cart Button */}
          {flags.feature_cart && (
            <button
              onClick={() => setIsCartOpen(true)}
              className={styles.cartHeaderBtn}
              aria-label="Open cart drawer"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Cart</span>
              {totalItemCount > 0 && <span className={styles.cartBadge}>{totalItemCount}</span>}
            </button>
          )}

          {/* Conditional Customer User Auth / Dashboard Link */}
          {flags.feature_auth && (
            user ? (
              <Link
                href="/account"
                className={`${styles.userAccountLink} ${pathname === '/account' ? styles.active : ''}`}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Hi, {user.name.split(' ')[0]}</span>
              </Link>
            ) : (
              <Link href="/login" className={styles.loginLink}>
                Sign In
              </Link>
            )
          )}

          <Link href="/quote" className={styles.quoteButton}>
            Get a Quote
          </Link>
        </nav>

        {/* Mobile Actions & Toggle */}
        <div className={styles.mobileRightActions}>
          {flags.feature_cart && (
            <button
              onClick={() => setIsCartOpen(true)}
              className={styles.mobileCartBtn}
              aria-label="Open cart"
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItemCount > 0 && <span className={styles.cartBadge}>{totalItemCount}</span>}
            </button>
          )}

          <button
            className={`${styles.menuToggle} ${isOpen ? styles.menuOpen : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Navigation */}
      <div className={`${styles.mobileNav} ${isOpen ? styles.mobileNavOpen : ''}`}>
        <nav className={styles.mobileNavLinks}>
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`${styles.mobileNavLink} ${isActive ? styles.active : ''}`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            );
          })}

          {flags.feature_auth && (
            user ? (
              <Link
                href="/account"
                className={styles.mobileNavLink}
                onClick={() => setIsOpen(false)}
              >
                👤 Customer Dashboard ({user.name.split(' ')[0]})
              </Link>
            ) : (
              <Link
                href="/login"
                className={styles.mobileNavLink}
                onClick={() => setIsOpen(false)}
              >
                🔑 Customer Sign In / Register
              </Link>
            )
          )}

          <Link
            href="/quote"
            className={styles.mobileQuoteButton}
            onClick={() => setIsOpen(false)}
          >
            Get a Quote
          </Link>
        </nav>
      </div>
    </header>
  );
}
