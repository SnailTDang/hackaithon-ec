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
    LinearProgress,
    Alert,
    Stack,
} from '@mui/material'
import { UseNDAChecklistReturn } from './modules/useNDAChecklist'

export const Template = ({
    loading,
    result,
    error,
    handleContractUpload,
    handleChecklistUpload,
    handleAnalyze,
    handleDownloadWordReport,
    handleDownloadExcel,
}: UseNDAChecklistReturn) => {
    return (
        <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
            <Typography variant="h4" fontWeight={700} mb={3}>
                NDA Contract Auto Checker (AI)
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
                <Button variant="contained" component="label">
                    Contract file (Word, PDF, TXT)
                    <input
                        type="file"
                        accept=".docx,.pdf,.txt"
                        hidden
                        onChange={handleContractUpload}
                    />
                </Button>
                <Button variant="contained" component="label" color="secondary">
                    Checklist file (.xlsx)
                    <input type="file" accept=".xlsx" hidden onChange={handleChecklistUpload} />
                </Button>
                {/* <TextField
                    type="password"
                    label="API Key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    sx={{ minWidth: 300 }}
                /> */}
            </Stack>
            <Button
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                onClick={handleAnalyze}
                sx={{ mb: 3 }}
            >
                {loading ? 'Processing...' : 'Analyze'}
            </Button>
            {loading && <LinearProgress sx={{ mb: 2 }} />}
            {result.length > 0 && (
                <Stack direction="row" spacing={2} mb={2} justifyContent="flex-end">
                    <Button variant="contained" color="success" onClick={handleDownloadWordReport}>
                        Download Word Report
                    </Button>
                    <Button variant="contained" color="info" onClick={handleDownloadExcel}>
                        Download Excel Report
                    </Button>
                </Stack>
            )}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
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
