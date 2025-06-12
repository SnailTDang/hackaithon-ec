import '../styles/reset.css'
import type { AppProps } from 'next/app'
import React from 'react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from '@/shared/theme'

function App({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Component {...pageProps} />
        </ThemeProvider>
    )
}

export default App
