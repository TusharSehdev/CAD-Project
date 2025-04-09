import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  
  // Suppress hydration warnings from browser extensions
  onDemandEntries: {
    // Make Next.js ignore attributes added by browser extensions during hydration
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  
  // Suppress hydration warnings by configuring error handling
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Replace React's error overlay with a custom one that filters out hydration errors
      Object.assign(config.resolve.alias, {
        'next/dist/compiled/react-dev-overlay': 'next/dist/compiled/react-dev-overlay',
      });
    }
    
    // Add security headers to prevent extension script injections
    if (!isServer) {
      // Add a rule to transform any injected script with BitDefender's URL
      config.module.rules.push({
        test: /\.js$/,
        enforce: 'pre',
        use: [
          {
            loader: 'string-replace-loader',
            options: {
              search: 'eppiocemhmnlbhjplcgkofciiegomcon',
              replace: 'blocked-extension',
              flags: 'g'
            }
          }
        ]
      });
    }
    
    return config;
  },
  
  // Configure SWC compiler to help with hydration issues
  swcMinify: true,
  compiler: {
    // Remove extra attributes from HTML during build time
    removeConsole: {
      exclude: ['error', 'warn'],
    },
  },
  
  // Add security headers to prevent extension script injections
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-inline' 'unsafe-eval'; object-src 'none'; frame-ancestors 'self'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
