import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={`${styles.badge} badge-pulse`}>
            <span className={`${styles.badgeDot} badge-pulse-dot`}></span>
            Established 1989 • Pioneer Enterprise
          </div>

          <h1 className={styles.title}>
            Diversified Excellence. <br />
            <span className={`${styles.titleHighlight} text-gradient`}>Pioneering Premium Solutions.</span>
          </h1>

          <p className={styles.description}>
            Itulah Nigeria Limited (formerly Mikado Nigeria Limited) delivers world-class electronic security, premium beverages, telecommunications infrastructure, and fine fragrances across the nation.
          </p>

          <div className={styles.ctas}>
            <Link href="/products" className={styles.primaryCta}>
              Explore Products
            </Link>
            <Link href="/quote" className={styles.secondaryCta}>
              Request a Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className={styles.introSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.grid2}>
            <div className={styles.introContent}>
              <div className={styles.sectionHeader}>
                <span className={styles.secSubtitle}>Our Legacy & Vision</span>
                <h2 className={styles.secTitle}>Over Three Decades of Growth, Innovation & Trust</h2>
              </div>
              <p>
                Since our inception on 1st January 1989, Itulah Nigeria Limited has been endowed with a successful history of providing quality services to a vast array of private and public sector clients.
              </p>
              <p>
                From electronic security to telecommunications, and fragrance & flavours distribution, we have grown rapidly by responding proactively to market needs. Customer satisfaction and consistent delivery of high-quality solutions are essential to our philosophy.
              </p>
              <div className={styles.introStats}>
                <div>
                  <div className={styles.statNumber}>1989</div>
                  <div className={styles.statLabel}>Founded</div>
                </div>
                <div>
                  <div className={styles.statNumber}>35+</div>
                  <div className={styles.statLabel}>Years Legacy</div>
                </div>
                <div>
                  <div className={styles.statNumber}>100%</div>
                  <div className={styles.statLabel}>Satisfaction</div>
                </div>
              </div>
            </div>

            <div className={styles.introVisual}>
              <Image
                src="/img/cctv.png"
                alt="Itulah Legacy Security and Infrastructure"
                fill
                sizes="(max-width: 992px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
                priority
              />
              <div className={styles.imageOverlay}></div>
              <div className={styles.visualCaption}>
                <h4 className={styles.visualTitle}>Lagos Head Office & Monitoring Hub</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Divisions Section */}
      <section className={styles.divisionsSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionIntro}>
            <span className={styles.secSubtitle}>What We Do</span>
            <h2 className={styles.secTitle}>Core Business Verticals</h2>
            <p className={styles.secIntroText}>
              Through highly seasoned professionals, we provide top-tier services across our main operational departments.
            </p>
          </div>

          <div className={styles.divisionGrid}>
            {/* Division 1: Spirits & Beverages */}
            <div className={`${styles.divCard} glass-card`}>
              <Image
                src="/img/alcoholic beverages.png"
                alt="Alcoholic Beverages"
                fill
                sizes="(max-width: 992px) 100vw, 33vw"
                className={styles.cardBg}
                style={{ objectFit: 'cover' }}
              />
              <div className={styles.cardGradient}></div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Spirits & Beverages</h3>
                <p className={styles.cardDesc}>
                  Distributing premium spirits, classic and cinnamon country-pride whiskeys, and the famous herbal Wild Octopus Liqueur.
                </p>
                <Link href="/products?cat=beverages" className={styles.cardLink}>
                  View Products &rarr;
                </Link>
              </div>
            </div>

            {/* Division 2: Security */}
            <div className={`${styles.divCard} glass-card`}>
              <Image
                src="/img/physical locks.png"
                alt="Security Solutions"
                fill
                sizes="(max-width: 992px) 100vw, 33vw"
                className={styles.cardBg}
                style={{ objectFit: 'cover' }}
              />
              <div className={styles.cardGradient}></div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Security Solutions</h3>
                <p className={styles.cardDesc}>
                  Advanced CCTV, intrusion alarms, access control systems, fire safety devices, and high-security German physical lock fittings.
                </p>
                <Link href="/products?cat=cctv" className={styles.cardLink}>
                  View Products &rarr;
                </Link>
              </div>
            </div>

            {/* Division 3: Fragrances & Telecom */}
            <div className={`${styles.divCard} glass-card`}>
              <Image
                src="/img/Fragrance.png"
                alt="Flavours & Fragrances"
                fill
                sizes="(max-width: 992px) 100vw, 33vw"
                className={styles.cardBg}
                style={{ objectFit: 'cover' }}
              />
              <div className={styles.cardGradient}></div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Flavours & Fragrances</h3>
                <p className={styles.cardDesc}>
                  Quality fragrance distribution for fine scents, body sprays, personal care, and oral flavors serving diverse food and cosmetic industries.
                </p>
                <Link href="/products?cat=fragrance" className={styles.cardLink}>
                  View Products &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Feature Banners Section */}
      <section className={styles.bannersSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionIntro}>
            <span className={styles.secSubtitle}>Spotlight Products</span>
            <h2 className={styles.secTitle}>Excellence in Action</h2>
          </div>

          {/* Banner 1: Wild Octopus */}
          <div className={styles.bannerCard}>
            <div className={styles.bannerText}>
              <span className={styles.bannerCategory}>Luxury Lifestyle • Spirits</span>
              <h3 className={styles.bannerTitle}>Wild Octopus Liqueur</h3>
              <p className={styles.bannerDesc}>
                A premium herbal liqueur formulated with fine botanical extracts, designed to offer a bold and balanced drinking experience. Ideal for social gatherings and refined personal collection.
              </p>
              <Link href="/products?cat=beverages" className={styles.primaryCta}>
                View Beverages
              </Link>
            </div>
            <div className={styles.bannerImageWrapper}>
              <Image
                src="/img/WildOctopus.png"
                alt="Wild Octopus Liqueur"
                fill
                sizes="(max-width: 992px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Banner 2: Security & CCTV */}
          <div className={`${styles.bannerCard} ${styles.bannerCardAlt}`}>
            <div className={styles.bannerText}>
              <span className={styles.bannerCategory} style={{ color: '#00f0ff' }}>Protection & Defense • CCTV</span>
              <h3 className={styles.bannerTitle}>Smart Surveillance Systems</h3>
              <p className={styles.bannerDesc}>
                Professional CCTV installation, smart doors, combination locks, and complete commercial intrusion panels. We design custom monitoring grids to keep your home, containers, and office premises safe.
              </p>
              <Link href="/products?cat=cctv" className={styles.primaryCta}>
                Explore CCTV Systems
              </Link>
            </div>
            <div className={styles.bannerImageWrapper}>
              <Image
                src="/img/cctv.png"
                alt="Surveillance Systems"
                fill
                sizes="(max-width: 992px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Banner 3: Puls Nutrition */}
          <div className={styles.bannerCard}>
            <div className={styles.bannerText}>
              <span className={styles.bannerCategory} style={{ color: '#a855f7' }}>Active Health • Supplements</span>
              <h3 className={styles.bannerTitle}>PULS Nutrition</h3>
              <p className={styles.bannerDesc}>
                Premium nutritional supplements, shakes, and sports hydration gear distributed directly across Nigeria. Fuel your active days and achieve your fitness targets with clean ingredients.
              </p>
              <Link href="/products?cat=supplements" className={styles.primaryCta}>
                See Supplements
              </Link>
            </div>
            <div className={styles.bannerImageWrapper}>
              <Image
                src="/img/Nutrition.png"
                alt="Puls Nutrition"
                fill
                sizes="(max-width: 992px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <h2 className={styles.ctaTitle}>Ready to Elevate Your Business or Lifestyle?</h2>
          <p className={styles.ctaDesc}>
            Get in touch with our team of technical experts and product specialists to procure custom-fit security installations, premium spirits, or bulk ingredient fragrances.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/quote" className={styles.primaryCta}>
              Request a Quote
            </Link>
            <Link href="/contact" className={styles.secondaryCta}>
              Contact Our Office
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
