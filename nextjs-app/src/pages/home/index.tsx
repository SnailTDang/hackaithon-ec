'use client'
import React from 'react'
import { Container, Typography, Box, Button } from '@mui/material'
import Link from 'next/link'

export default function HomePage() {
    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="60vh"
                bgcolor="background.paper"
                boxShadow={3}
                borderRadius={2}
                p={4}
            >
                <Typography variant="h3" component="h1" gutterBottom>
                    Welcome to Hackaithon!
                </Typography>
                <Typography variant="h6" color="text.secondary" align="center" gutterBottom>
                    Start building your Next.js + Material UI project.
                </Typography>
                <Link href="/analyst" passHref prefetch={false}>
                    <Button variant="contained" color="primary" size="large" sx={{ mt: 3 }}>
                        Get Started
                    </Button>
                </Link>
            </Box>
        </Container>
    )
}
