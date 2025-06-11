/* eslint-disable react/react-in-jsx-scope */
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    const isDev = process.env.NODE_ENV === 'development'
    return (
        <Html>
            <Head></Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
