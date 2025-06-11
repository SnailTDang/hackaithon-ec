import React, { FC } from 'react'
import { Box, Button, Typography } from '@mui/material'

type DropzoneContractProps = {
    onDrop: (file: File) => void
    isProcessing: boolean
}

const DropzoneContract: FC<DropzoneContractProps> = ({ onDrop, isProcessing }) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) onDrop(file)
    }

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            p={2}
            border={1}
            borderColor="#cccccc"
            borderRadius={2}
            sx={{ background: '#fafafa', minHeight: 150 }}
        >
            <Typography variant="h6" mb={2}>
                Upload Contract File
            </Typography>
            <Button variant="contained" component="label" color="warning" disabled={isProcessing}>
                Select File (.docx, .pdf, image)
                <input type="file" hidden onChange={handleFileChange} accept=".docx,.pdf,image/*" />
            </Button>
        </Box>
    )
}

export default DropzoneContract
