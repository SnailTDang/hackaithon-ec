import React from 'react'
import { NextPageContext } from 'next'
import { Container, Typography, Box, Paper } from '@mui/material'

interface ErrorProps {
    statusCode?: number
    message?: string
}

function Error({ statusCode, message }: ErrorProps) {
    return (
        <Container maxWidth="sm">
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="60vh"
            >
                <Paper elevation={3} sx={{ padding: 4, width: '100%', textAlign: 'center' }}>
                    <Typography variant="h2" color="error" gutterBottom>
                        {statusCode ? `Error ${statusCode}` : 'An error occurred'}
                    </Typography>
                    <Typography variant="body1">
                        {message || 'Sorry, something went wrong.'}
                    </Typography>
                </Paper>
            </Box>
        </Container>
    )
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
    const statusCode = res?.statusCode || err?.statusCode || 404
    const message = err?.message || ''
    return { statusCode, message }
}

export default Error
