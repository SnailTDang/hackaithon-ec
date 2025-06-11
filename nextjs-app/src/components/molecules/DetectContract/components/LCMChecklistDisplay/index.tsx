import React, { FC } from 'react'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

type LCMChecklistDisplayProps = {
    lcmChecklist: string
}

const LCMChecklistDisplay: FC<LCMChecklistDisplayProps> = ({ lcmChecklist }) => {
    if (!lcmChecklist) return null
    return (
        <Paper elevation={2} sx={{ p: 2, mb: 2, bgcolor: '#f8f8f8' }}>
            <Typography variant="h6" gutterBottom>
                LCM Checklist:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {lcmChecklist}
                </Typography>
            </Box>
        </Paper>
    )
}

export default LCMChecklistDisplay
