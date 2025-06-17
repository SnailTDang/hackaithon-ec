/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { File } from 'lucide-react'
import * as XLSX from 'xlsx'
import * as mammoth from 'mammoth'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Alert from '@mui/material/Alert'
import Markdown from 'react-markdown'

// Define types for file content
interface ImageContent {
    url: string
}
interface PdfContent {
    url: string
}
interface DocxContent {
    html: string
}
interface ExcelContent {
    sheets: Record<string, string[][]>
}

type FileContent = ImageContent | PdfContent | DocxContent | ExcelContent | string | null

type FileType = 'image' | 'pdf' | 'docx' | 'excel' | 'unsupported' | 'string' | null

interface FilePreviewProps {
    file: File | null
    content: string | null
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, content }) => {
    const [fileContent, setFileContent] = useState<FileContent>(null)
    const [fileType, setFileType] = useState<FileType>(null)
    const [error, setError] = useState<string | null>(null)

    const getFileType = (file: File): FileType => {
        if (content) return 'string'
        const extension = file.name.toLowerCase().split('.').pop() || ''
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(extension)) {
            return 'image'
        } else if (extension === 'pdf') {
            return 'pdf'
        } else if (extension === 'docx') {
            return 'docx'
        } else if (['xlsx', 'xls'].includes(extension)) {
            return 'excel'
        }
        return 'unsupported'
    }

    const processFile = async (file: File | null) => {
        if (!file) return

        setError(null)
        try {
            const type = getFileType(file)
            setFileType(type)
            switch (type) {
                case 'image': {
                    const imageUrl = URL.createObjectURL(file)
                    setFileContent({ url: imageUrl })
                    break
                }
                case 'pdf': {
                    const pdfUrl = URL.createObjectURL(file)
                    setFileContent({ url: pdfUrl })
                    break
                }
                case 'docx': {
                    const arrayBuffer = await file.arrayBuffer()
                    const result = await mammoth.convertToHtml({ arrayBuffer })
                    setFileContent({ html: result.value })
                    break
                }
                case 'excel': {
                    const excelBuffer = await file.arrayBuffer()
                    const workbook = XLSX.read(excelBuffer, { type: 'array' })
                    const sheets: Record<string, string[][]> = {}
                    workbook.SheetNames.forEach((sheetName) => {
                        const worksheet = workbook.Sheets[sheetName]
                        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as (
                            | string
                            | number
                            | boolean
                            | null
                        )[][]
                        sheets[sheetName] = jsonData.map((row) =>
                            row.map((cell) => (cell == null ? '' : String(cell))),
                        )
                    })
                    setFileContent({ sheets })
                    break
                }
                case 'string': {
                    setFileContent(content)
                    break
                }
                default:
                    throw new Error('Unsupported file format')
            }
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : String(err)
            setError(`Error processing file: ${errorMsg}`)
            setFileContent(null)
        }
    }

    const renderPreview = () => {
        if (error) {
            return (
                <Alert severity="error" sx={{ my: 4 }}>
                    <Box display="flex" alignItems="center" flexDirection="column">
                        <File
                            style={{ width: 48, height: 48, color: '#d32f2f', marginBottom: 8 }}
                        />
                        <Typography color="error">{error}</Typography>
                    </Box>
                </Alert>
            )
        }
        if (!fileContent) return null
        switch (fileType) {
            case 'image':
                return (
                    <Box display="flex" justifyContent="center" my={2}>
                        <Box
                            component="iframe"
                            src={(fileContent as ImageContent).url}
                            sx={{
                                width: '100%',
                                height: 600,
                                border: 0,
                            }}
                            title="Preview"
                        />
                    </Box>
                )
            case 'pdf':
                return (
                    <Box width="100%" my={2}>
                        <Box
                            component="iframe"
                            src={(fileContent as PdfContent).url}
                            sx={{
                                width: '100%',
                                height: 600,
                                border: 0,
                                borderRadius: 2,
                            }}
                            title="PDF Preview"
                        />
                    </Box>
                )
            case 'docx':
                return (
                    <Paper
                        sx={{
                            p: 3,
                            bgcolor: 'background.paper',
                            borderRadius: 2,
                            maxHeight: 384,
                            overflowY: 'auto',
                            my: 2,
                        }}
                    >
                        <Box
                            sx={{ '& .prose': { m: 0 } }}
                            dangerouslySetInnerHTML={{ __html: (fileContent as DocxContent).html }}
                        />
                    </Paper>
                )
            case 'excel':
                return (
                    <Box display="flex" flexDirection="column" gap={3}>
                        {Object.entries((fileContent as ExcelContent).sheets).map(
                            ([sheetName, data]) => (
                                <Paper key={sheetName} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                                    <Box
                                        bgcolor="grey.100"
                                        px={2}
                                        py={1}
                                        borderBottom={1}
                                        borderColor="divider"
                                    >
                                        <Typography
                                            variant="subtitle1"
                                            fontWeight={600}
                                            color="text.primary"
                                        >
                                            {sheetName}
                                        </Typography>
                                    </Box>
                                    <TableContainer sx={{ maxHeight: 256 }}>
                                        <Table size="small" stickyHeader>
                                            <TableHead>
                                                <TableRow>
                                                    {(data[0] || []).map((cell, cellIndex) => (
                                                        <TableCell
                                                            key={cellIndex}
                                                            sx={{ fontWeight: 600 }}
                                                        >
                                                            {cell || ''}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {data.slice(1, 21).map((row, rowIndex) => (
                                                    <TableRow key={rowIndex}>
                                                        {row.map((cell, cellIndex) => (
                                                            <TableCell key={cellIndex}>
                                                                {cell || ''}
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    {data.length > 21 && (
                                        <Box
                                            p={2}
                                            textAlign="center"
                                            color="text.secondary"
                                            fontSize={14}
                                        >
                                            ... and {data.length - 21} more rows
                                        </Box>
                                    )}
                                </Paper>
                            ),
                        )}
                    </Box>
                )
            case 'string': {
                {
                    console.log(content)
                }
                return (
                    <Paper
                        sx={{
                            p: 3,
                            bgcolor: 'background.paper',
                            borderRadius: 2,
                            maxHeight: 384,
                            overflowY: 'auto',
                            my: 2,
                        }}
                    >
                        <Markdown>{content}</Markdown>
                    </Paper>
                )
            }
            default:
                return (
                    <Paper
                        sx={{
                            p: 3,
                            bgcolor: 'background.paper',
                            borderRadius: 2,
                            maxHeight: 384,
                            overflowY: 'auto',
                            my: 2,
                        }}
                    >
                        <Markdown>{content}</Markdown>
                    </Paper>
                )
        }
    }

    useEffect(() => {
        if (!file && !content) return
        processFile(file)
        setFileContent(content)
    }, [file, content])

    return <Box>{renderPreview()}</Box>
}

export default FilePreview
