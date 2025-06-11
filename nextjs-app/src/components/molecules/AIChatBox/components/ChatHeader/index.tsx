import React from 'react'
import { Bot, RotateCcw, MoreVertical } from 'lucide-react'
import { AppBar, Toolbar, Typography, Box, IconButton, Chip, Avatar } from '@mui/material'

const ChatHeader = ({ handleNewChat }) => (
    <AppBar position="static" color="primary" elevation={2} sx={{ mb: 2 }}>
        <Toolbar sx={{ justifyContent: 'space-between', maxWidth: 900, mx: 'auto', width: '100%' }}>
            <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: 'white', color: 'primary.main', width: 40, height: 40 }}>
                    <Bot size={20} />
                </Avatar>
                <Typography variant="h6" fontWeight={600} color="white">
                    Claude AI Assistant
                </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
                <Chip label="Online" color="success" size="small" />
                <IconButton onClick={handleNewChat} color="inherit" title="New Chat">
                    <RotateCcw size={18} />
                </IconButton>
                <IconButton color="inherit">
                    <MoreVertical size={18} />
                </IconButton>
            </Box>
        </Toolbar>
    </AppBar>
)

export default ChatHeader
