import Image from 'next/image';
import styles from './page.module.css';

export const metadata = {
  title: "About Us | Itulah Nigeria Limited",
  description: "Learn more about Itulah Nigeria Limited. Discover our history since 1989, our corporate vision, mission, and core professional values.",
};

export default function About() {
  const values = [
    { name: 'Integrity' },
    { name: 'Professionalism' },
    { name: 'Commitment' },
    { name: 'Responsiveness' },
    { name: 'Can-do Attitude' }
  ];

  return (
    <div className={styles.aboutPage}>
      {/* Hero Header */}
      <section className={styles.hero}>
        <span className={styles.tagline}>Corporate Background</span>
        <h1 className={styles.title}>About Our Company</h1>
      </section>

      <div className={styles.container}>
        {/* History Block */}
        <section className={styles.historyBlock}>
          <div className={styles.imageWrapper}>
            <Image
              src="/img/wildOctopus1.jpeg"
              alt="Itulah Nigeria Limited Office & Products"
              fill
              sizes="(max-width: 900px) 100vw, 40vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className={styles.historyText}>
            <h2>Our Journey Since 1989</h2>
            <p>
              Since inception, Itulah Nigeria Limited has been endowed with a successful history of providing quality services to a vast array of private and public sector clients.
            </p>
            <p>
              We commenced business on 1st January, 1989 and have consistently embarked on a series of dynamic and diversified business expansion initiatives. Ever since, we have gone on to grow highly successful businesses in sectors ranging from premium beverages and sports nutrition to fragrance and flavours distribution.
            </p>
            <p>
              We have grown rapidly with the ability to create and respond directly to market opportunities. Customer satisfaction and consistent delivery of high-quality solutions are essential to our philosophy, and we approach all of our projects in the same proven manner.
            </p>
            <p>
              Each project is implemented based on industry-standard conventions with a striving commitment to meet the client's exact requirements, uncompromised by any vested interest. We are a highly diversified and multifaceted organization managed by a crop of highly seasoned professionals.
            </p>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className={styles.mvSection}>
          <div className={styles.mvCard}>
            <h3>Our Vision</h3>
            <p>
              To serve our esteemed customers with superior products and services that create value, driven by our ardour and commitment to excellence.
            </p>
          </div>
          <div className={styles.mvCard}>
            <h3>Our Mission</h3>
            <p>
              To provide products and services that deliver satisfaction to our customers whilst ensuring sustainable growth, utilizing best practices and assuring value to our stakeholders.
            </p>
          </div>
        </section>

        {/* Core Values Section */}
        <section className={styles.valuesSection}>
          <h2 className={styles.valuesTitle}>Our Core Values</h2>
          <div className={styles.valuesGrid}>
            {values.map((v) => (
              <div key={v.name} className={styles.valueCard}>
                <span className={styles.valueName}>{v.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Our Belief */}
        <section className={styles.beliefSection}>
          <h3 className={styles.beliefTitle}>Our Belief</h3>
          <p className={styles.beliefText}>
            "We believe in making a difference by ensuring full customer satisfaction. We stand for value, quality, innovation, fun, and senses of competitive challenges."
          </p>
        </section>
      </div>
    </div>
  );
}
