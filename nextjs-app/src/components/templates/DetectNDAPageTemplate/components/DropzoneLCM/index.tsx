import React, { FC } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { Accept, useDropzone } from 'react-dropzone'

type DropzoneLCMProps = {
    onDrop: (file: File) => void
    isProcessing: boolean
}

const DropzoneLCM: FC<DropzoneLCMProps> = ({ onDrop, isProcessing }) => {
    const { getRootProps, getInputProps } = useDropzone({
        accept: ['.xlsx'] as unknown as Accept,
        onDrop: (files) => {
            const file = files[0]
            onDrop(file)
        },
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
                Upload LCM Checklist File
            </Typography>
            <Button variant="contained" component="label" color="warning" disabled={isProcessing}>
                Select File (.xlsx)
                <input
                    {...getInputProps()}
                    type="file"
                    accept=".xlsx"
                    hidden
                    // onChange={handleFileChange}
                />
            </Button>
        </Box>
    )
}

export default DropzoneLCM
