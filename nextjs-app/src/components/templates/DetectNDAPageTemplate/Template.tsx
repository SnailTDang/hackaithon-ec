import React from 'react'
import { Box, Snackbar, Alert, Tab, Tabs, Button, Toolbar, Container } from '@mui/material'
import { ChecklistResultsDisplay } from './components/ChecklistResultsDisplay'
import ContractAnalysis from './components/ContractAnalysis'
import FileUploadSection from './components/FileUploadSection'
import PreviewDialog from './components/PreviewDialog'
import ProcessingIndicator from './components/ProcessingIndicator'
import { UseDetectContractReturn } from './module/useDetectContract'

const DetectContract = (props: UseDetectContractReturn) => {
    const {
        tabResult,
        contractFile,
        lcmFile,
        contractText,
        lcmChecklist,
        isProcessing,
        error,
        isProcessingDelivery,
        setError,
        contractImportantText,
        lcmChecklistResults,
        previewDialog,
        setPreviewDialog,
        uploadError,
        setUploadError,
        uploadSuccess,
        deliveryContract,
        handleChangeTab,
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
    } = props

    return (
        <Container maxWidth="xl" sx={{ mt: 2, mb: 2 }}>
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
                                setPreviewDialog((state) => {
                                    return {
                                        ...state,
                                        content: '',
                                        file: file,
                                        title: title,
                                        open: true,
                                    }
                                })
                            }
                            isProcessing={isProcessing}
                            onAnalyseContract={processContractText}
                            handleAnalyzeChecklist={handleAnalyzeChecklist}
                        />
                    </Box>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Tabs
                                value={tabResult}
                                onChange={(_, value) => {
                                    handleChangeTab(value)
                                }}
                                aria-label="main tabs"
                            >
                                <Tab label="Analyze Contract" />
                                <Tab label="Analyze Checklist" />
                            </Tabs>
                            <Box sx={{ ml: 4 }}>
                                <Button
                                    sx={{ px: 2 }}
                                    size="medium"
                                    onClick={handleSaveButton}
                                    disabled={
                                        (!contractImportantText?.length &&
                                            !lcmChecklistResults.length) ||
                                        isProcessing
                                    }
                                >
                                    Save Analyst Results
                                </Button>
                            </Box>
                        </Toolbar>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <PreviewDialog
                            open={previewDialog.open}
                            title={previewDialog.title}
                            file={previewDialog.file}
                            content={previewDialog.content}
                            onClose={() =>
                                setPreviewDialog((state) => {
                                    return {
                                        ...state,
                                        open: false,
                                    }
                                })
                            }
                        />
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
                        <Box sx={{ display: tabResult === 0 ? 'block' : 'none' }}>
                            <ContractAnalysis
                                contractImportantText={contractImportantText}
                                isProcessing={isProcessingDelivery}
                                onPreviewDelivery={() =>
                                    setPreviewDialog((state) => {
                                        return {
                                            ...state,
                                            content: deliveryContract,
                                            open: true,
                                        }
                                    })
                                }
                            />
                        </Box>
                        <Box sx={{ display: tabResult === 1 ? 'block' : 'none' }}>
                            <ChecklistResultsDisplay
                                result={lcmChecklistResults}
                                disabledButton={!lcmChecklistResults.length}
                                handleDownloadExcel={handleDownloadExcel}
                                handleDownloadWordReport={handleDownloadWordReport}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Container>
    )
}

export default DetectContract
