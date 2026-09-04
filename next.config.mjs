import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: root,
  serverExternalPackages: [
    '@google/generative-ai',
    'bcryptjs',
    'cloudinary',
    'express',
    'form-data',
    'jsonwebtoken',
    'multer',
    'mysql2',
    'nodemailer'
  ],
  webpack(config) {
    config.resolve.alias['react-router-dom'] = path.join(root, 'src/lib/react-router-dom.jsx');
    return config;
  },
  async headers() {
    return [{
      source: '/model/:path*',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]
    }];
  }
};

export default nextConfig;
