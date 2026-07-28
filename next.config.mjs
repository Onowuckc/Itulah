/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['better-sqlite3'],
  outputFileTracingIncludes: {
    '/api/**/*': ['./database.sqlite'],
    '/**/*': ['./database.sqlite'],
  },
};

export default nextConfig;
