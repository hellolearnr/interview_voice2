import type { NextConfig } from "next";

const nextConfig: NextConfig = {
images: {
          domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com', 'cdn.discordapp.com', 'www.gravatar.com'],
        },

  async headers() {
    return [
      {
        source: '/(.*)',
        
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://apis.google.com https://www.googletagmanager.com https://www.google-analytics.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
