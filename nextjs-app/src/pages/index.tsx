import React from 'react'
import { Container, Typography, Box, Button } from '@mui/material'
import Link from 'next/link'

export default function HomePage() {
    return (
        <Container maxWidth="md" sx={{ mt: 8 }}>
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
                    Welcome to EC Synergy - Hackaithon!
                </Typography>
                <Typography variant="h6" color="text.secondary" align="center" gutterBottom>
                    Start analyze your smart contracts with our AI-powered tools.
                </Typography>
                <Link href="/nda-manager" passHref prefetch={false}>
                    <Button variant="contained" color="primary" size="large" sx={{ mt: 3 }}>
                        Get Started
                    </Button>
                </Link>
            </Box>
        </Container>
    )
}
