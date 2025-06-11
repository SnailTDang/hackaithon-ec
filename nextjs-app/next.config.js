/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development'

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
        if (!isDev) return []
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
