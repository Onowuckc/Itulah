export default async function sitemap() {
  const baseUrl = 'https://itulah.com.ng';

  const staticRoutes = [
    '',
    '/about',
    '/products',
    '/gallery',
    '/blog',
    '/contact',
    '/quote',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic product categories & keywords for SEO
  const productCategories = [
    '?cat=beverages',
    '?cat=fragrance',
    '?cat=nutrition',
  ].map((cat) => ({
    url: `${baseUrl}/products${cat}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  return [...staticRoutes, ...productCategories];
}
