import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import db from '@/lib/db';
import styles from '../page.module.css';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const post = db.prepare('SELECT * FROM blogs WHERE slug = ?').get(resolvedParams.slug);
  if (!post) return { title: 'Article Not Found' };
  
  return {
    title: `${post.title} | Blog`,
    description: post.content.replace(/<[^>]*>/g, '').substring(0, 160),
  };
}

export default async function BlogDetailPage({ params }) {
  const resolvedParams = await params;
  const post = db.prepare('SELECT * FROM blogs WHERE slug = ?').get(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <Link href="/blog" className={styles.backLink}>
        &larr; Back to Blog
      </Link>
      
      <article className={styles.animateFadeIn}>
        <header className={styles.detailHeader}>
          <div className={styles.detailMeta}>
            <span>{post.category}</span>
            <span className={styles.detailMetaSpan}>|</span>
            <span>By {post.author}</span>
            <span className={styles.detailMetaSpan}>|</span>
            <span>{post.date}</span>
          </div>
          <h1 className={styles.detailTitle}>{post.title}</h1>
        </header>

        <div className={styles.detailImageWrapper}>
          <Image
            src={post.imageUrl || '/img/logo.png'}
            alt={post.title}
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>

        <div 
          className={styles.contentWrapper}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}
