import React from 'react'
import { Box, Typography, IconButton, Button } from '@mui/material'
import {
    Description,
    PictureAsPdf,
    Image as ImageIcon,
    Delete,
    Visibility,
} from '@mui/icons-material'
import DropzoneContract from '../DropzoneContract'
import DropzoneLCM from '../DropzoneLCM'

interface FileUploadSectionProps {
    contractFile: File | null
    lcmFile: File | null
    contractText: string
    lcmChecklist: string
    onContractDrop: (file: File) => void
    onLcmDrop: (file: File) => void
    onContractDelete: () => void
    onLcmDelete: () => void
    onPreviewClick: (content: string, title: string) => void
    isProcessing: boolean
    onAnalyseContract: () => void
}

const FileUploadSection = ({
    contractFile,
    lcmFile,
    contractText,
    lcmChecklist,
    isProcessing,
    onContractDrop,
    onLcmDrop,
    onContractDelete,
    onLcmDelete,
    onPreviewClick,
    onAnalyseContract,
}: FileUploadSectionProps) => {
    const getFileIcon = (file: File | null) => {
        if (!file) return <Description />
        if (file.type.includes('pdf')) return <PictureAsPdf color="error" />
        if (file.type.includes('word')) return <Description color="warning" />
        if (file.type.startsWith('image/')) return <ImageIcon color="success" />
        return <Description />
    }

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1048576) return Math.round(bytes / 1024) + ' KB'
        return Math.round(bytes / 1048576) + ' MB'
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 4 }}>
            <Box sx={{ flex: 1 }}>
                <DropzoneContract onDrop={onContractDrop} isProcessing={isProcessing} />
                {contractFile && (
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                        {getFileIcon(contractFile)}
                        <Box sx={{ ml: 2 }}>
                            <Typography variant="body2">{contractFile.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                {formatFileSize(contractFile.size)}
                            </Typography>
                        </Box>
                        <IconButton color="error" sx={{ ml: 2 }} onClick={onContractDelete}>
                            <Delete />
                        </IconButton>
                        <IconButton
                            color="warning"
                            sx={{ ml: 1 }}
                            onClick={() => onPreviewClick(contractText, contractFile.name)}
                        >
                            <Visibility />
                        </IconButton>

                        <Button
                            sx={{ ml: 4 }}
                            variant="contained"
                            color="primary"
                            onClick={onAnalyseContract}
                            disabled={isProcessing || !contractFile}
                        >
                            Phân tích hợp đồng
                        </Button>
                    </Box>
                )}
            </Box>
            <Box sx={{ flex: 1 }}>
                <DropzoneLCM onDrop={onLcmDrop} />
                {lcmFile && (
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                        {getFileIcon(lcmFile)}
                        <Box sx={{ ml: 2 }}>
                            <Typography variant="body2">{lcmFile.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                {formatFileSize(lcmFile.size)}
                            </Typography>
                        </Box>
                        <IconButton color="error" sx={{ ml: 2 }} onClick={onLcmDelete}>
                            <Delete />
                        </IconButton>
                        <IconButton
                            color="warning"
                            sx={{ ml: 1 }}
                            onClick={() => onPreviewClick(lcmChecklist, lcmFile.name)}
                        >
                            <Visibility />
                        </IconButton>
                    </Box>
                )}
            </Box>
        </Box>
    )
}

export default FileUploadSection
