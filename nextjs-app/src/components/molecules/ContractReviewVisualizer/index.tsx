import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const ContractReviewVisualizer = ({ data, lcmChecklistResults, level = 0 }) => {
    if (!data || typeof data !== 'object') return null

    const getStyle = (isHighlighted) => ({
        color: isHighlighted ? 'error.main' : 'text.primary',
        border: isHighlighted ? '2px solid #f44336' : 'none',
        bgcolor: isHighlighted ? 'rgba(244,67,54,0.08)' : 'background.paper',
        borderRadius: 1,
        px: isHighlighted ? 1 : 0,
        py: isHighlighted ? 0.5 : 0,
        fontWeight: isHighlighted ? 600 : 400,
        mb: 1,
    })

    return (
        <Box sx={{ pl: level * 3 }}>
            {Object.entries(data).map(([key, value]) => {
                const isHighlighted = lcmChecklistResults && key in lcmChecklistResults
                if (value && typeof value === 'object') {
                    return (
                        <Box key={key} mb={1}>
                            <Typography sx={getStyle(isHighlighted)} variant="subtitle1">
                                {key}
                            </Typography>
                            <ContractReviewVisualizer
                                data={value}
                                lcmChecklistResults={lcmChecklistResults}
                                level={level + 1}
                            />
                        </Box>
                    )
                }
                return (
                    <Box key={key} component="span" sx={{ display: 'block', mb: 1 }}>
                        <Box component="span" sx={getStyle(isHighlighted)}>
                            <Typography variant="body2">
                                <strong>{key}:</strong> {String(value)}
                            </Typography>
                        </Box>
                    </Box>
                )
            })}
        </Box>
    )
}

export default ContractReviewVisualizer
