import React, { useState } from 'react'
import { Box, Snackbar, Alert, Tab, Tabs, Button, Toolbar } from '@mui/material'
import { useDetectContract } from '../../module/useDetectContract'
import FileUploadSection from './FileUploadSection'
import ProcessingIndicator from './ProcessingIndicator'
import ContractAnalysis from './ContractAnalysis'
import PreviewDialog from './PreviewDialog'
import { ChecklistResultsDisplay } from './ChecklistResultsDisplay'

const DetectContract = () => {
    const {
        contractFile,
        lcmFile,
        contractText,
        lcmChecklist,
        isProcessing,
        error,
        setError,
        contractImportantText,
        lcmChecklistResults,
        previewDialog,
        setPreviewDialog,
        uploadError,
        setUploadError,
        uploadSuccess,
        setUploadSuccess,
        handleContractDrop,
        processContractText,
        handleAnalyzeChecklist,
        onLcmDelete,
        onContractDelete,
        setLcmFile,
        handleSaveButton,
        handleDownloadWordReport,
        handleDownloadExcel,
    } = useDetectContract()

    const [tab, setTab] = useState(0)

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue)
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
            <Box>
                <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
                    <FileUploadSection
                        contractFile={contractFile}
                        lcmFile={lcmFile}
                        contractText={contractText}
                        lcmChecklist={lcmChecklist}
                        onContractDrop={handleContractDrop}
                        onLcmDrop={setLcmFile}
                        onContractDelete={onContractDelete}
                        onLcmDelete={onLcmDelete}
                        onPreviewClick={(file, title) =>
                            setPreviewDialog({ open: true, content: file, title })
                        }
                        isProcessing={isProcessing}
                        onAnalyseContract={processContractText}
                        handleAnalyzeChecklist={handleAnalyzeChecklist}
                    />
                </Box>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Toolbar>
                        <Tabs value={tab} onChange={handleChange} aria-label="main tabs">
                            <Tab label="Analyze Contract" />
                            <Tab label="Analyze Checklist" />
                        </Tabs>
                        <Box sx={{ ml: 4 }}>
                            <Button
                                sx={{ px: 2 }}
                                size="medium"
                                onClick={handleSaveButton}
                                disabled={
                                    !contractFile &&
                                    !lcmChecklistResults.length &&
                                    !contractImportantText
                                }
                            >
                                Save Analyst Results
                            </Button>
                        </Box>
                    </Toolbar>
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
                            file={previewDialog.content}
                            onClose={() =>
                                setPreviewDialog({ open: false, content: null, title: '' })
                            }
                        />
                    </Box>
                    <Box sx={{ display: tab === 1 ? 'block' : 'none' }}>
                        <ChecklistResultsDisplay
                            result={lcmChecklistResults}
                            handleDownloadExcel={handleDownloadExcel}
                            handleDownloadWordReport={handleDownloadWordReport}
                        />
                        <PreviewDialog
                            open={previewDialog.open}
                            title={previewDialog.title}
                            file={previewDialog.content}
                            onClose={() =>
                                setPreviewDialog({ open: false, content: null, title: '' })
                            }
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default DetectContract
