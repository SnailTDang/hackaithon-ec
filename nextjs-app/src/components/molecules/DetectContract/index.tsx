import React, { useState } from 'react'
import { Box, Snackbar, Alert, Tab, Tabs } from '@mui/material'
import { useDetectContract } from './module/useDetectContract'
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

    const [tab, setTab] = useState(0)

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue)
    }

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
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tab} onChange={handleChange} aria-label="main tabs">
                        <Tab label="Analyze Contract" />
                        <Tab label="Analyze Checklist" />
                    </Tabs>
                </Box>
                <Box sx={{ mt: 2 }}>
                    <ProcessingIndicator
                        isProcessing={isProcessing}
                        error={error}
                        onErrorClose={() => setError('')}
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
                    <Box sx={{ display: tab === 0 ? 'block' : 'none' }}>
                        <ContractAnalysis contractImportantText={contractImportantText} />
                        <PreviewDialog
                            open={previewDialog.open}
                            title={previewDialog.title}
                            content={previewDialog.content}
                            onClose={() =>
                                setPreviewDialog({ open: false, content: '', title: '' })
                            }
                        />
                    </Box>
                    <Box sx={{ display: tab === 1 ? 'block' : 'none' }}>
                        <LCMChecklistResults lcmChecklistResults={lcmChecklistResults} />
                        <PreviewDialog
                            open={previewDialog.open}
                            title={previewDialog.title}
                            content={previewDialog.content}
                            onClose={() =>
                                setPreviewDialog({ open: false, content: '', title: '' })
                            }
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default DetectContract
