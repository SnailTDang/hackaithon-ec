import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material'

interface PreviewDialogProps {
    open: boolean
    title: string
    content: string
    onClose: () => void
}

const PreviewDialog = ({ open, title, content, onClose }: PreviewDialogProps) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <TextField
                    multiline
                    rows={15}
                    fullWidth
                    value={content}
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                    sx={{ mt: 1 }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}

export default PreviewDialog
