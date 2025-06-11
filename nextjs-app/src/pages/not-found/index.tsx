import React from 'react'
import { Box, Typography, Button } from '@mui/material'
import Link from 'next/link'

const NotFoundPage = () => (
    <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        bgcolor="#f5f5f5"
    >
        <Typography variant="h1" color="primary" gutterBottom>
            404
        </Typography>
        <Typography variant="h5" color="textSecondary" gutterBottom>
            Oops! The page you are looking for does not exist.
        </Typography>
        <Link href="/home" passHref>
            <Button variant="contained" color="primary">
                Go to Home
            </Button>
        </Link>
    </Box>
)

export default NotFoundPage
