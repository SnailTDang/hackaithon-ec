import React from 'react'
import { Box, Typography } from '@mui/material'

const Header = () => {
    return (
        <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 4, mt: 6 }}>
            <Box
                sx={{
                    maxWidth: 1200,
                    mx: 'auto',
                    px: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h3" component="h1" fontWeight="bold" textAlign="center">
                    Intelligent Contract Data Extraction & Review
                </Typography>
            </Box>
        </Box>
    )
}

export default Header
