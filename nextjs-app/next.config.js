/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ['localhost', 'yourdomain.com'],
    },
    env: {
        // Example: API_URL: process.env.NEXT_PUBLIC_API_URL
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: "script-src 'self' 'unsafe-eval'",
                    },
                ],
            },
        ]
    },
}

module.exports = nextConfig
