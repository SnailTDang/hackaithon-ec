import React from 'react'
import {
    Box,
    Paper,
    Typography,
    Alert,
    CircularProgress,
    Button,
    Input,
    Link,
    List,
    ListItem,
    ListItemText,
    Divider,
} from '@mui/material'

interface NDAAnalyzerTemplateProps {
    file: File | null
    setFile: (file: File | null) => void
    loading: boolean
    error: string | null
    handleAnalyze: () => void
    sections: { title: string; content: string }[] | null
    docUrl: string | null
    apiKey?: string
}

const Template: React.FC<NDAAnalyzerTemplateProps> = ({
    file,
    setFile,
    loading,
    error,
    handleAnalyze,
    sections,
    docUrl,
    apiKey,
}) => {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 4 }}>
            <Paper elevation={3} sx={{ maxWidth: 600, mx: 'auto', p: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    NDA Analyzer – Xuất File Word Báo Cáo
                </Typography>
                <Typography variant="body1" align="center" color="text.secondary" gutterBottom>
                    Upload hợp đồng NDA (.docx, .pdf, .txt)
                </Typography>
                <Input
                    type="file"
                    inputProps={{ accept: '.txt,.docx,.pdf' }}
                    fullWidth
                    onChange={(e) => {
                        const input = e.target as HTMLInputElement
                        setFile(input.files?.[0] || null)
                    }}
                    sx={{ my: 2 }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading || !file || !apiKey}
                    onClick={handleAnalyze}
                    sx={{ mb: 2 }}
                >
                    {loading ? <CircularProgress size={24} /> : 'Phân tích hợp đồng'}
                </Button>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                {sections && (
                    <Box mt={4}>
                        <Typography variant="h5" align="center" gutterBottom>
                            Kết quả bóc tách NDA
                        </Typography>
                        <List>
                            {sections.map((sec, idx) => (
                                <React.Fragment key={idx}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemText
                                            primary={
                                                <b>
                                                    {idx + 1}. {sec.title}
                                                </b>
                                            }
                                            secondary={
                                                <span
                                                    dangerouslySetInnerHTML={{
                                                        __html: sec.content,
                                                    }}
                                                />
                                            }
                                        />
                                    </ListItem>
                                    {idx < sections.length - 1 && <Divider component="li" />}
                                </React.Fragment>
                            ))}
                        </List>
                        {docUrl && (
                            <Box textAlign="center" mt={2}>
                                <Link
                                    href={docUrl}
                                    download="NDA_Report.docx"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    underline="hover"
                                    variant="body1"
                                >
                                    ⬇️ Tải file báo cáo .docx
                                </Link>
                            </Box>
                        )}
                    </Box>
                )}
            </Paper>
            <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 4 }}>
                &copy; {new Date().getFullYear()} NDA Analyzer – Powered by EC
            </Typography>
        </Box>
    )
}

export default Template
