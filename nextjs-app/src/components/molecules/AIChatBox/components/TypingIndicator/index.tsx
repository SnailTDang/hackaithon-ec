import React from 'react'
import { Bot } from 'lucide-react'
import { Box, Avatar, Typography, Paper, CircularProgress } from '@mui/material'

const TypingIndicator = () => (
    <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>
            <Bot size={20} />
        </Avatar>
        <Paper
            elevation={1}
            sx={{
                px: 2,
                py: 1.5,
                borderRadius: 3,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'grey.200',
            }}
        >
            <Box display="flex" alignItems="center" gap={1}>
                <CircularProgress size={16} thickness={6} sx={{ color: 'grey.400' }} />
                <Typography variant="caption" color="text.secondary">
                    Claude is typing...
                </Typography>
            </Box>
        </Paper>
    </Box>
)

export default TypingIndicator
