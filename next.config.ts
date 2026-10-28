import type { NextConfig } from 'next'

// Static export for GitHub Pages. zacbe.dev is a custom domain, so there is no basePath.
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  images: { unoptimized: true },
  // The whole site's CSS is ~10 KB: inlining it saves a render-blocking request per page.
  experimental: { inlineCss: true },
}

export default nextConfig
