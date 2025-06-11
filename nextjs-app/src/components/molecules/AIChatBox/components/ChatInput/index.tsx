import React, { useRef } from 'react'
import { Send } from 'lucide-react'
import { Box, TextField, IconButton } from '@mui/material'

const ChatInput = ({ inputValue, setInputValue, handleSendMessage, handleKeyPress, isTyping }) => {
    const inputRef = useRef(null)
    return (
        <Box display="flex" gap={2} alignItems="flex-end">
            <TextField
                inputRef={inputRef}
                fullWidth
                multiline
                minRows={1}
                maxRows={4}
                variant="outlined"
                placeholder="Message Claude..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isTyping}
                sx={{ background: 'background.paper', borderRadius: 2 }}
            />
            <IconButton
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                color="primary"
                size="large"
                sx={{
                    bgcolor: !inputValue.trim() || isTyping ? 'grey.300' : 'primary.main',
                    color: 'white',
                    borderRadius: 2,
                    height: 48,
                    width: 48,
                    '&:hover': { bgcolor: 'primary.dark' },
                }}
            >
                <Send size={22} />
            </IconButton>
        </Box>
    )
}

export default ChatInput
