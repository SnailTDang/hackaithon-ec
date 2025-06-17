import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import FilePreview from './ContentFileRender'

interface PreviewDialogProps {
    open: boolean
    title: string
    file: File | null
    onClose: () => void
    content: string | null
}

const PreviewDialog = ({ open, title, file, onClose, content }: PreviewDialogProps) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <FilePreview file={file} content={content} />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}

export default PreviewDialog
