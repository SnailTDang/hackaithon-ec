import React from 'react'
import {
    Box,
    Typography,
    Card,
    CardContent,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemText,
} from '@mui/material'
import { Assignment, ExpandMore } from '@mui/icons-material'

interface LCMChecklistResultsProps {
    lcmChecklistResults: Record<string, unknown> | null
}

const LCMChecklistResults = ({ lcmChecklistResults }: LCMChecklistResultsProps) => {
    if (!lcmChecklistResults) return null

    return (
        <Card elevation={3} sx={{ mb: 3 }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Assignment color="warning" sx={{ mr: 2 }} />
                    <Typography variant="h5" fontWeight="bold">
                        LCM Checklist Comparison Results
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                    {Object.entries(lcmChecklistResults).map(([section, value], idx) => (
                        <Box key={section} sx={{ flex: 1, mb: 2 }}>
                            <Accordion defaultExpanded={idx === 0}>
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Typography variant="h6">{section}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {Array.isArray(value) ? (
                                        <List dense>
                                            {value.map((item, i) => (
                                                <ListItem key={i}>
                                                    <ListItemText
                                                        primary={
                                                            typeof item === 'string'
                                                                ? item
                                                                : JSON.stringify(item)
                                                        }
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    ) : typeof value === 'object' && value !== null ? (
                                        <List dense>
                                            {Object.entries(value).map(([k, v], i) => (
                                                <ListItem key={i}>
                                                    <ListItemText
                                                        primary={k}
                                                        secondary={
                                                            typeof v === 'string'
                                                                ? v
                                                                : JSON.stringify(v)
                                                        }
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    ) : (
                                        <Typography>
                                            {value !== undefined ? String(value) : ''}
                                        </Typography>
                                    )}
                                </AccordionDetails>
                            </Accordion>
                        </Box>
                    ))}
                </Box>
            </CardContent>
        </Card>
    )
}

export default LCMChecklistResults
