/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development'

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ['localhost', 'yourdomain.com', 'blob:'],
    },
    env: {
        // Example: API_URL: process.env.NEXT_PUBLIC_API_URL
    },
    async headers() {
        if (!isDev) return []
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' cdnjs.cloudflare.com blob: cdn.jsdelivr.net blob:;
              worker-src 'self' blob:;
              style-src 'self' 'unsafe-inline';
              connect-src 'self' data:;
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'none';
              img-src 'self' data: blob:;
              frame-src 'self' blob:; 
            `
                            .replace(/\s{2,}/g, ' ')
                            .trim(),
                    },
                ],
            },
        ]
    },
}

module.exports = nextConfig
