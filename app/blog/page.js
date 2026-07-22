import Image from 'next/image';
import Link from 'next/link';
import db from '@/lib/db';
import styles from './page.module.css';

export const metadata = {
  title: "Blog & Industry News | Itulah Nigeria Limited",
  description: "Stay updated with recent articles and industry tips from Itulah Nigeria Limited: how to choose security cameras, premium beverages recipes, and fragrance guides.",
};

export const dynamic = 'force-dynamic';

export default function BlogPage() {
  let posts = [];
  try {
    posts = db.prepare('SELECT * FROM blogs ORDER BY id DESC').all();
  } catch (err) {
    console.error("Database query failed on BlogPage mount:", err);
  }

  // Helper to remove HTML tags for card description snippets
  const getSnippet = (htmlContent) => {
    const text = htmlContent.replace(/<[^>]*>/g, '');
    return text.length > 120 ? text.substring(0, 117) + '...' : text;
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>Blog & Corporate News</h1>
        <p className={styles.subtitle}>Insights from our security experts and product catalog specialists</p>
      </div>

      <div className={styles.grid}>
        {posts.map((post) => (
          <div key={post.id} className={styles.card}>
            <div className={styles.imageWrapper}>
              <Image
                src={post.imageUrl || '/img/logo.png'}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 350px"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className={styles.cardBody}>
              <div className={styles.meta}>
                <span>{post.category}</span>
                <span>{post.date}</span>
              </div>
              <h3 className={styles.cardTitle}>{post.title}</h3>
              <p className={styles.cardDesc}>{getSnippet(post.content)}</p>
              <Link href={`/blog/${post.slug}`} className={styles.readMore}>
                Read Article &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
