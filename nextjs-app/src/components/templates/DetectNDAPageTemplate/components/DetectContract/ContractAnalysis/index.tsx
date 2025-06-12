import React from 'react'
import {
    Box,
    Typography,
    Card,
    CardContent,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material'
import { Analytics, ExpandMore } from '@mui/icons-material'
import { Section } from '@/shared/constants/prompts'

type ContractAnalysisProps = {
    contractImportantText: Section[] | null
}

const ContractAnalysis = ({ contractImportantText }: ContractAnalysisProps) => {
    if (!contractImportantText || !Array.isArray(contractImportantText)) return null

    return (
        <Card elevation={3} sx={{ mb: 3 }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Analytics color="primary" sx={{ mr: 2 }} />
                    <Typography variant="h5" fontWeight="bold">
                        Contract Analysis Results
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {contractImportantText.map((section, idx) => (
                        <Accordion key={section.title} defaultExpanded={idx === 0}>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography variant="h6">{section.title}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography
                                    variant="body1"
                                    sx={{ whiteSpace: 'pre-line' }}
                                    component="div"
                                    dangerouslySetInnerHTML={{ __html: section.content }}
                                />
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            </CardContent>
        </Card>
    )
}

export default ContractAnalysis
