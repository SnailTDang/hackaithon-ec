import React, { useState, useCallback } from 'react'
import {
    Box,
    Paper,
    Typography,
    Button,
    Card,
    CardContent,
    LinearProgress,
    Alert,
    Chip,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    // Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material'
import {
    CloudUpload,
    Description,
    PictureAsPdf,
    Image,
    Delete,
    Visibility,
    CheckCircle,
    Error,
    ExpandMore,
    Analytics,
    Assignment,
} from '@mui/icons-material'
import Grid from '@mui/material/Grid'
import * as mammoth from 'mammoth'

const ContractDataExtraction = () => {
    const [contractFile, setContractFile] = useState(null)
    const [checklistFile, setChecklistFile] = useState(null)
    const [contractContent, setContractContent] = useState('')
    const [checklistContent, setChecklistContent] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState('')
    type ExtractedData = {
        parties: {
            contractor: string
            client: string
            witnesses: string[]
        }
        financials: {
            totalValue: string
            paymentTerms: string
            currency: string
            milestonePayments: { milestone: string; amount: string; date: string }[]
        }
        timeline: {
            startDate: string
            endDate: string
            duration: string
            keyMilestones: string[]
        }
        terms: {
            terminationClause: string
            liabilityLimit: string
            warrantyPeriod: string
            forcemajeure: string
        }
        risks: { level: string; description: string }[]
    }
    const [extractedData, setExtractedData] = useState<ExtractedData | null>(null)
    const [previewDialog, setPreviewDialog] = useState({ open: false, content: '', title: '' })

    // Simulate contract data extraction
    const extractContractData = (content) => {
        const mockData = {
            parties: {
                contractor: 'ABC Construction Co.',
                client: 'XYZ Corporation',
                witnesses: ['John Smith', 'Jane Doe'],
            },
            financials: {
                totalValue: '$500,000',
                paymentTerms: 'Net 30 days',
                currency: 'USD',
                milestonePayments: [
                    { milestone: 'Project Start', amount: '$100,000', date: '2024-01-15' },
                    { milestone: '50% Completion', amount: '$200,000', date: '2024-03-15' },
                    { milestone: 'Final Delivery', amount: '$200,000', date: '2024-05-15' },
                ],
            },
            timeline: {
                startDate: '2024-01-15',
                endDate: '2024-05-15',
                duration: '4 months',
                keyMilestones: [
                    'Foundation completion by Feb 15',
                    'Structural work by Mar 30',
                    'Final inspection by May 10',
                ],
            },
            terms: {
                terminationClause: 'Either party may terminate with 30 days notice',
                liabilityLimit: '$1,000,000',
                warrantyPeriod: '12 months',
                forcemajeure: 'Standard force majeure clause included',
            },
            risks: [
                { level: 'High', description: 'Weather delays not adequately covered' },
                { level: 'Medium', description: 'Payment terms favor client heavily' },
                { level: 'Low', description: 'Standard liability clauses in place' },
            ],
        }
        return mockData
    }

    const handleFileUpload = useCallback(async (file, type) => {
        setError('')
        setIsProcessing(true)

        try {
            let content = ''

            if (
                file.type ===
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ) {
                // Handle DOCX files
                const arrayBuffer = await file.arrayBuffer()
                const result = await mammoth.extractRawText({ arrayBuffer })
                content = result.value
            } else if (file.type === 'application/pdf') {
                // For PDF files - in a real app, you'd use pdf-parse or similar
                content = `PDF file uploaded: ${file.name}\n\nNote: PDF parsing would require additional libraries like pdf-parse. This is a simulation showing the extracted content structure.`
            } else if (file.type.startsWith('image/')) {
                // For images - in a real app, you'd use OCR like Tesseract.js
                content = `Image file uploaded: ${file.name}\n\nNote: OCR functionality would require libraries like Tesseract.js to extract text from images.`
            } else {
                throw Error('Unsupported file type')
            }

            if (type === 'contract') {
                setContractFile(file)
                setContractContent(content)
                // Extract contract data
                const extracted = extractContractData(content)
                setExtractedData(extracted)
            } else {
                setChecklistFile(file)
                setChecklistContent(content)
            }
        } catch (err) {
            setError(`Error processing file: ${err.message}`)
        } finally {
            setIsProcessing(false)
        }
    }, [])

    const getFileIcon = (file) => {
        if (!file) return <Description />
        if (file.type.includes('pdf')) return <PictureAsPdf color="error" />
        if (file.type.includes('word')) return <Description color="primary" />
        if (file.type.startsWith('image/')) return <Image color="success" />
        return <Description />
    }

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1048576) return Math.round(bytes / 1024) + ' KB'
        return Math.round(bytes / 1048576) + ' MB'
    }

    const FileUploadCard = ({ title, subtitle, file, onFileSelect, acceptedTypes }) => (
        <Card elevation={2} sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Typography variant="h6" gutterBottom color="text.primary">
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {subtitle}
                </Typography>

                {!file ? (
                    <Box>
                        <input
                            accept={acceptedTypes}
                            style={{ display: 'none' }}
                            id={`upload-${title}`}
                            type="file"
                            onChange={(e) => {
                                const files = e.target.files
                                if (files && files[0]) {
                                    onFileSelect(files[0])
                                }
                            }}
                        />
                        <label htmlFor={`upload-${title}`}>
                            <Button
                                variant="contained"
                                component="span"
                                startIcon={<CloudUpload />}
                                size="large"
                                sx={{ borderRadius: 2 }}
                            >
                                SELECT FILE
                            </Button>
                        </label>
                    </Box>
                ) : (
                    <Box>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 2,
                            }}
                        >
                            {getFileIcon(file)}
                            <Box sx={{ ml: 2, textAlign: 'left' }}>
                                <Typography variant="body2" fontWeight="medium">
                                    {file.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {formatFileSize(file.size)}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <IconButton
                                color="primary"
                                onClick={() =>
                                    setPreviewDialog({
                                        open: true,
                                        content:
                                            title === 'Upload Contract File'
                                                ? contractContent
                                                : checklistContent,
                                        title: file.name,
                                    })
                                }
                            >
                                <Visibility />
                            </IconButton>
                            <IconButton
                                color="error"
                                onClick={() => {
                                    if (title === 'Upload Contract File') {
                                        setContractFile(null)
                                        setContractContent('')
                                        setExtractedData(null)
                                    } else {
                                        setChecklistFile(null)
                                        setChecklistContent('')
                                    }
                                }}
                            >
                                <Delete />
                            </IconButton>
                        </Box>
                    </Box>
                )}
            </CardContent>
        </Card>
    )

    const getRiskColor = (level) => {
        switch (level) {
            case 'High':
                return 'error'
            case 'Medium':
                return 'warning'
            case 'Low':
                return 'success'
            default:
                return 'default'
        }
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
            {/* Header */}
            <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 4 }}>
                <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
                    <Typography variant="h3" component="h1" fontWeight="bold" textAlign="center">
                        Intelligent Contract Data Extraction & Review
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
                {/* File Upload Section */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                        <FileUploadCard
                            title="Upload Contract File"
                            subtitle="DOCX, PDF, or Image files supported"
                            file={contractFile}
                            onFileSelect={(file) => handleFileUpload(file, 'contract')}
                            acceptedTypes=".docx,.pdf,image/*"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FileUploadCard
                            title="Upload LCM Checklist File"
                            subtitle="DOCX files supported"
                            file={checklistFile}
                            onFileSelect={(file) => handleFileUpload(file, 'checklist')}
                            acceptedTypes=".docx"
                        />
                    </Grid>
                </Grid>

                {/* Processing Indicator */}
                {isProcessing && (
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Processing Files...
                            </Typography>
                            <LinearProgress sx={{ mb: 2 }} />
                            <Typography variant="body2" color="text.secondary">
                                Extracting and analyzing contract data
                            </Typography>
                        </CardContent>
                    </Card>
                )}

                {/* Error Display */}
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}

                {/* Extracted Data Display */}
                {extractedData && (
                    <Card elevation={3}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Analytics color="primary" sx={{ mr: 2 }} />
                                <Typography variant="h5" fontWeight="bold">
                                    Contract Analysis Results
                                </Typography>
                            </Box>

                            <Grid container spacing={3}>
                                {/* Parties Section */}
                                <Grid item xs={12} md={6}>
                                    <Accordion defaultExpanded>
                                        <AccordionSummary expandIcon={<ExpandMore />}>
                                            <Typography variant="h6">Contract Parties</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <List dense>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Contractor"
                                                        secondary={extractedData.parties.contractor}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Client"
                                                        secondary={extractedData.parties.client}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Witnesses"
                                                        secondary={extractedData.parties.witnesses.join(
                                                            ', ',
                                                        )}
                                                    />
                                                </ListItem>
                                            </List>
                                        </AccordionDetails>
                                    </Accordion>
                                </Grid>

                                {/* Financial Section */}
                                <Grid item xs={12} md={6}>
                                    <Accordion defaultExpanded>
                                        <AccordionSummary expandIcon={<ExpandMore />}>
                                            <Typography variant="h6">Financial Terms</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <List dense>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Total Value"
                                                        secondary={
                                                            extractedData.financials.totalValue
                                                        }
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Payment Terms"
                                                        secondary={
                                                            extractedData.financials.paymentTerms
                                                        }
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Currency"
                                                        secondary={
                                                            extractedData.financials.currency
                                                        }
                                                    />
                                                </ListItem>
                                            </List>
                                        </AccordionDetails>
                                    </Accordion>
                                </Grid>

                                {/* Timeline Section */}
                                <Grid item xs={12} md={6}>
                                    <Accordion>
                                        <AccordionSummary expandIcon={<ExpandMore />}>
                                            <Typography variant="h6">Project Timeline</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <List dense>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Start Date"
                                                        secondary={extractedData.timeline.startDate}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="End Date"
                                                        secondary={extractedData.timeline.endDate}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Duration"
                                                        secondary={extractedData.timeline.duration}
                                                    />
                                                </ListItem>
                                            </List>
                                        </AccordionDetails>
                                    </Accordion>
                                </Grid>

                                {/* Risk Assessment */}
                                <Grid item xs={12} md={6}>
                                    <Accordion>
                                        <AccordionSummary expandIcon={<ExpandMore />}>
                                            <Typography variant="h6">Risk Assessment</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <List dense>
                                                {extractedData.risks.map((risk, index) => (
                                                    <ListItem key={index}>
                                                        <ListItemIcon>
                                                            <Chip
                                                                label={risk.level}
                                                                color={getRiskColor(risk.level)}
                                                                size="small"
                                                            />
                                                        </ListItemIcon>
                                                        <ListItemText primary={risk.description} />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </AccordionDetails>
                                    </Accordion>
                                </Grid>
                            </Grid>

                            {/* Action Buttons */}
                            <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'center' }}>
                                <Button variant="contained" startIcon={<Assignment />} size="large">
                                    Generate Report
                                </Button>
                                <Button variant="outlined" startIcon={<CheckCircle />} size="large">
                                    Approve Contract
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                )}

                {/* Preview Dialog */}
                <Dialog
                    open={previewDialog.open}
                    onClose={() => setPreviewDialog({ open: false, content: '', title: '' })}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>{previewDialog.title}</DialogTitle>
                    <DialogContent>
                        <TextField
                            multiline
                            rows={15}
                            fullWidth
                            value={previewDialog.content}
                            variant="outlined"
                            InputProps={{ readOnly: true }}
                            sx={{ mt: 1 }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() =>
                                setPreviewDialog({ open: false, content: '', title: '' })
                            }
                        >
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    )
}

export default ContractDataExtraction
