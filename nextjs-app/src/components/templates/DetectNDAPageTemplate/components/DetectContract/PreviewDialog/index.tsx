import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import FilePreview from './ContentFileRender'

interface PreviewDialogProps {
    open: boolean
    title: string
    file: File | null
    onClose: () => void
}

const PreviewDialog = ({ open, title, file, onClose }: PreviewDialogProps) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <FilePreview file={file} />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}

export default PreviewDialog
