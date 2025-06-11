/* eslint-disable react/react-in-jsx-scope */
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    const isDev = process.env.NODE_ENV === 'development'
    return (
        <Html>
            <Head>
                {/* Inject CSP meta only in development for Fast Refresh */}
                {isDev && (
                    <meta
                        httpEquiv="Content-Security-Policy"
                        content="script-src 'self' 'unsafe-eval'"
                    />
                )}
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
