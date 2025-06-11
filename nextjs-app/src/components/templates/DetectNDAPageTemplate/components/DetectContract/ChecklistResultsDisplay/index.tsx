/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/label-has-associated-control */

import React from 'react'
import {
    Box,
    Button,
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Alert,
    Stack,
} from '@mui/material'
import { UseNDAChecklistReturn } from '@/components/templates/NDAChecklistTemplate/modules/useNDAChecklist'

export const ChecklistResultsDisplay = ({ result }) => {
    return (
        <Container maxWidth="xl" sx={{ mt: 5, mb: 5 }}>
            {result.length > 0 && (
                <Stack direction="row" spacing={2} mb={2} justifyContent="flex-end">
                    <Button
                        variant="contained"
                        color="success"
                        // onClick={handleDownloadWordReport}
                    >
                        Download Word Report
                    </Button>
                    <Button
                        variant="contained"
                        color="info"
                        //  onClick={handleDownloadExcel}
                    >
                        Download Excel Report
                    </Button>
                </Stack>
            )}

            {result.length > 0 && (
                <TableContainer component={Paper} sx={{ mt: 3 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Item</TableCell>
                                <TableCell>Standard</TableCell>
                                <TableCell>Frequency</TableCell>
                                <TableCell>Found Text</TableCell>
                                <TableCell>Review Result</TableCell>
                                <TableCell>Suggest</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {result.map((row, idx) => (
                                <TableRow
                                    key={idx}
                                    sx={{ background: idx % 2 ? '#f1f4fa' : undefined }}
                                >
                                    <TableCell>{idx + 1}</TableCell>
                                    <TableCell>{row.item}</TableCell>
                                    <TableCell>{row.standard}</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>{row.frequency}</TableCell>
                                    <TableCell
                                        sx={{
                                            fontWeight: 400,
                                            color:
                                                row.review_result === 'OK'
                                                    ? 'black'
                                                    : row.review_result === 'NOK'
                                                      ? 'crimson'
                                                      : '#888',
                                        }}
                                    >
                                        {row.review_result === 'OK' ? (
                                            <Box
                                                component="mark"
                                                sx={{ background: '#fff666', px: 0.5 }}
                                            >
                                                {row.found_text}
                                            </Box>
                                        ) : row.review_result === 'NOK' ? (
                                            <Box
                                                component="mark"
                                                sx={{
                                                    background: '#ff6666',
                                                    color: '#222',
                                                    px: 0.5,
                                                }}
                                            >
                                                {row.found_text}
                                            </Box>
                                        ) : (
                                            row.found_text
                                        )}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            fontWeight: 700,
                                            color:
                                                row.review_result === 'OK'
                                                    ? 'green'
                                                    : row.review_result === 'NOK'
                                                      ? 'crimson'
                                                      : '#888',
                                        }}
                                    >
                                        {row.review_result}
                                    </TableCell>
                                    <TableCell sx={{ color: '#c00' }}>
                                        {row.suggest || ''}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    )
}
