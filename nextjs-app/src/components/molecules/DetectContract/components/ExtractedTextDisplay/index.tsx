import React, { FC } from 'react'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

type ExtractedTextDisplayProps = {
    contractText: string
}

const ExtractedTextDisplay: FC<ExtractedTextDisplayProps> = ({ contractText }) => {
    if (!contractText) return null
    return (
        <Paper elevation={2} sx={{ p: 2, mb: 2, bgcolor: '#f8f8f8' }}>
            <Typography variant="h6" gutterBottom>
                Extract Contract Information:
            </Typography>
            <Box sx={{ whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
                <Typography variant="body2">{contractText}</Typography>
            </Box>
        </Paper>
    )
}

export default ExtractedTextDisplay
