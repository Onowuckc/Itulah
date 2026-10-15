export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/admin/'],
      },
    ],
    sitemap: 'https://www.itulahng.com/sitemap.xml',
  };
}
