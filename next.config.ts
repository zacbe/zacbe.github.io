import type { NextConfig } from 'next'

// Static export for GitHub Pages. zacbe.dev is a custom domain, so there is no basePath.
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  images: { unoptimized: true },
}

export default nextConfig
