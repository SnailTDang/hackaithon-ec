import React from 'react'
import { Card, CardContent, LinearProgress, Typography, Alert } from '@mui/material'

interface ProcessingIndicatorProps {
    isProcessing: boolean
    error: string
    onErrorClose: () => void
}

const ProcessingIndicator = ({ isProcessing, error, onErrorClose }: ProcessingIndicatorProps) => {
    return (
        <>
            {isProcessing && (
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Processing Files...
                        </Typography>
                        <LinearProgress sx={{ mb: 2 }} />
                        <Typography variant="body2" color="text.secondary">
                            Extracting and analyzing contract data
                        </Typography>
                    </CardContent>
                </Card>
            )}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={onErrorClose}>
                    {error}
                </Alert>
            )}
        </>
    )
}

export default ProcessingIndicator
