/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import ContractReviewVisualizer from '../../../ContractReviewVisualizer'
import Box from '@mui/material/Box'

type ResultsDisplayProps = {
    contractImportantText: any
    lcmChecklistResults: any
}

const ResultsDisplay: FC<ResultsDisplayProps> = ({
    contractImportantText,
    lcmChecklistResults,
}) => {
    if (!lcmChecklistResults) return null
    return (
        <Paper elevation={2} sx={{ p: 2, mb: 2, bgcolor: '#f8f8f8' }}>
            <Typography variant="h6" gutterBottom>
                Results Compared With LCM Checklist:
            </Typography>
            <Box display="flex" flexDirection="column">
                <ContractReviewVisualizer
                    data={contractImportantText}
                    lcmChecklistResults={lcmChecklistResults}
                />
            </Box>
        </Paper>
    )
}

export default ResultsDisplay
