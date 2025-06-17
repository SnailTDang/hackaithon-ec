import React, { FC, useCallback } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { Accept, useDropzone } from 'react-dropzone'

type DropzoneContractProps = {
    onDrop: (file: File) => void
    isProcessing: boolean
}

const DropzoneContract: FC<DropzoneContractProps> = ({ onDrop, isProcessing }) => {
    const handleDropfile = useCallback((files) => {
        const file = files[0]
        return onDrop(file)
    }, [])

    const { getRootProps, getInputProps } = useDropzone({
        accept: ['.docx', '.pdf', 'image/*'] as unknown as Accept,
        onDrop: handleDropfile,
    })

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
            {...getRootProps()}
        >
            <Typography variant="h6" mb={2}>
                Upload Contract File
            </Typography>
            <Button variant="contained" component="label" color="warning" disabled={isProcessing}>
                Select File (.docx, .pdf, image)
                <input
                    {...getInputProps()}
                    type="file"
                    hidden
                    // onChange={handleFileChange}
                    accept=".docx,.pdf,image/*"
                />
            </Button>
        </Box>
    )
}

export default DropzoneContract
