import React from 'react'
import { Box, Snackbar, Alert } from '@mui/material'
import { useDetectContract } from './hooks/useDetectContract'
import Header from './components/Header'
import FileUploadSection from './components/FileUploadSection'
import ProcessingIndicator from './components/ProcessingIndicator'
import ContractAnalysis from './components/ContractAnalysis'
import LCMChecklistResults from './components/LCMChecklistResults'
import PreviewDialog from './components/PreviewDialog'

const DetectContract = () => {
    const {
        contractFile,
        setContractFile,
        lcmFile,
        setLcmFile,
        contractText,
        setContractText,
        lcmChecklist,
        setLcmChecklist,
        isProcessing,
        error,
        setError,
        contractImportantText,
        setContractImportantText,
        lcmChecklistResults,
        setLcmChecklistResults,
        previewDialog,
        setPreviewDialog,
        uploadError,
        setUploadError,
        uploadSuccess,
        setUploadSuccess,
        handleUploadContract,
        handleLcmDrop,
        processContractText,
    } = useDetectContract()

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
            <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
                <FileUploadSection
                    contractFile={contractFile}
                    lcmFile={lcmFile}
                    contractText={contractText}
                    lcmChecklist={lcmChecklist}
                    onContractDrop={handleUploadContract}
                    onLcmDrop={handleLcmDrop}
                    onContractDelete={() => {
                        setContractFile(null)
                        setContractText('')
                        setContractImportantText(null)
                    }}
                    onLcmDelete={() => {
                        setLcmFile(null)
                        setLcmChecklist('')
                        setLcmChecklistResults(null)
                    }}
                    onPreviewClick={(content, title) =>
                        setPreviewDialog({ open: true, content, title })
                    }
                    isProcessing={isProcessing}
                    onAnalyseContract={processContractText}
                />
                <ProcessingIndicator
                    isProcessing={isProcessing}
                    error={error}
                    onErrorClose={() => setError('')}
                />
                <ContractAnalysis contractImportantText={contractImportantText} />
                <LCMChecklistResults lcmChecklistResults={lcmChecklistResults} />
                <PreviewDialog
                    open={previewDialog.open}
                    title={previewDialog.title}
                    content={previewDialog.content}
                    onClose={() => setPreviewDialog({ open: false, content: '', title: '' })}
                />
                <Snackbar
                    open={!!uploadError}
                    autoHideDuration={6000}
                    onClose={() => setUploadError('')}
                >
                    <Alert severity="error" onClose={() => setUploadError('')}>
                        {uploadError}
                    </Alert>
                </Snackbar>
                <Snackbar
                    open={!!uploadSuccess}
                    autoHideDuration={6000}
                    onClose={() => setUploadSuccess('')}
                >
                    <Alert severity="success" onClose={() => setUploadSuccess('')}>
                        {uploadSuccess}
                    </Alert>
                </Snackbar>
            </Box>
        </Box>
    )
}

export default DetectContract
