import React, { useEffect, useState } from 'react'
import { Bot, User } from 'lucide-react'
import { Box, Avatar, Typography, Paper } from '@mui/material'

export type MessageBubbleProps = {
    message: {
        id: number | string
        text: string
        sender: 'user' | 'ai'
        timestamp: Date | string
    }
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
    const isUser = message.sender === 'user'
    const [time, setTime] = useState('')

    useEffect(() => {
        setTime(
            message.timestamp instanceof Date
                ? message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                  })
                : new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                  }),
        )
    }, [message.timestamp])

    return (
        <Box
            display="flex"
            flexDirection={isUser ? 'row-reverse' : 'row'}
            mb={2}
            gap={2}
            alignItems="flex-end"
        >
            <Avatar
                sx={{ bgcolor: isUser ? 'primary.main' : 'secondary.main', width: 40, height: 40 }}
            >
                {isUser ? <User size={20} /> : <Bot size={20} />}
            </Avatar>
            <Box maxWidth="70%">
                <Paper
                    elevation={2}
                    sx={{
                        px: 2,
                        py: 1.5,
                        borderRadius: 3,
                        bgcolor: isUser ? 'primary.main' : 'background.paper',
                        color: isUser ? 'common.white' : 'text.primary',
                        border: isUser ? 'none' : '1px solid',
                        borderColor: isUser ? 'primary.main' : 'grey.200',
                        position: 'relative',
                    }}
                >
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {message.text}
                    </Typography>
                </Paper>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    align={isUser ? 'right' : 'left'}
                    sx={{ mt: 0.5, px: 1 }}
                >
                    {time}
                </Typography>
            </Box>
        </Box>
    )
}

export default MessageBubble
