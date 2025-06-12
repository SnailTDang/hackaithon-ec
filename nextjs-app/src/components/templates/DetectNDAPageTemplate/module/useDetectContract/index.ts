/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import * as XLSX from 'xlsx'

import {
    extractTextFromImage,
    extractTextFromDocx,
    extractTextFromPdf,
    extractContractInfo,
    handlePreviewContract,
} from '../hanldeDetect'
import { uploadFile } from '../uploadFile'
import { buildPromptChecklist } from 'shared/constants/prompts'
import axios from 'axios'

type ChecklistRow = {
    item: string
    standard: string
    frequency: string
}

export const useDetectContract = () => {
    const [contractFile, setContractFile] = useState<File | null>(null)
    const [lcmFile, setLcmFile] = useState<File | null>(null)
    const [contractText, setContractText] = useState('')
    const [lcmChecklist, setLcmChecklist] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState('')
    const [contractImportantText, setContractImportantText] = useState(null)
    const [lcmChecklistResults, setLcmChecklistResults] = useState<any[]>([])
    const [previewDialog, setPreviewDialog] = useState({ open: false, content: '', title: '' })
    const [uploadError, setUploadError] = useState('')
    const [uploadSuccess, setUploadSuccess] = useState('')
    const [checklistRows, setChecklistRows] = useState<any[][]>([])

    const handleUploadContract = (file: File) => {
        if (file) {
            setUploadError('')
            setUploadSuccess('')
            uploadFile(
                file,
                (msg) => {
                    setUploadSuccess(msg)
                    setContractFile(file)
                    if (file.type.includes('image')) {
                        extractTextFromImage(file, setContractText, () => {})
                    } else if (file.type === 'application/pdf') {
                        extractTextFromPdf(file, setContractText)
                    } else if (file.name.endsWith('.docx')) {
                        extractTextFromDocx(file, setContractText)
                    }
                },
                (msg) => setUploadError(msg),
                setIsProcessing,
            )
        }
    }

    const handleContractDrop = async (file: File) => {
        setError('')
        setIsProcessing(true)
        setContractFile(file)
        try {
            if (file.type.includes('image')) {
                await extractTextFromImage(file, setContractText, () => {})
            } else if (file.type === 'application/pdf') {
                await extractTextFromPdf(file, setContractText)
            } else if (file.name.endsWith('.docx')) {
                await extractTextFromDocx(file, setContractText)
            } else {
                throw new Error('Unsupported file type')
            }
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : String(err)
            setError(`Error processing contract file: ${errorMsg}`)
        } finally {
            setIsProcessing(false)
        }
    }

    const handleLcmDrop = async (file: File) => {
        setError('')
        setIsProcessing(true)
        setLcmFile(file)
        if (file) {
            file.arrayBuffer().then((arrBuf) => {
                const wb = XLSX.read(arrBuf, { type: 'array' })
                const sheet = wb.Sheets[wb.SheetNames[0]]
                const json: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 })
                setChecklistRows(json)
            })
        }
        setIsProcessing(false)
    }

    const parseChecklistExcel = (arrayBuffer: ArrayBuffer): ChecklistRow[] => {
        const workbook = XLSX.read(arrayBuffer, { type: 'array' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const json: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 })

        // const headers = (json[0] || []).map((h: any) => (h || '').toLowerCase())
        const headers = (json[2] || []).map((h: any) => (h || '').toLowerCase())
        const idxItem = headers.findIndex((v: string) => v.includes('item'))
        const idxStandard = headers.findIndex((v: string) => v.includes('standard'))
        const idxFreq = headers.findIndex((v: string) => v.includes('frequency'))

        return json
            .slice(1)
            .filter((r: any[]) => r[idxItem] && r[idxStandard])
            .map((r: any[]) => ({
                item: r[idxItem],
                standard: r[idxStandard],
                frequency: (r[idxFreq] || '').toString().trim(),
            }))
    }

    const handleAnalyzeChecklist = async () => {
        setError('')
        setLcmChecklistResults([])
        setIsProcessing(true)
        if (!contractText || !lcmFile) {
            setError('Vui lòng chọn đủ 2 file')
            return
        }
        try {
            const arrayBuffer = await lcmFile.arrayBuffer()
            const checklist = parseChecklistExcel(arrayBuffer)
            const checklistTable = checklist
                .map(
                    (r: any, i: number) =>
                        `${i + 1}. Item: ${r.item}\nStandard terms & conditions: ${r.standard}\nFrequency of Terms in the NDA: ${r.frequency}`,
                )
                .join('\n')
            const prompt = buildPromptChecklist(checklistTable, contractText)
            const res = await axios.post('/api/analyze-contract', {
                model: 'deepseek/deepseek-r1-0528:free',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.1,
            })
            const content = res.data.choices?.[0]?.message?.content ?? ''
            let jsonContent: any[] = []
            try {
                // Remove leading ```json or ``` if present before parsing
                let cleanedData = content
                if (typeof cleanedData === 'string') {
                    cleanedData = cleanedData.replace(/^```json|^```/i, '').trim()
                    // Remove trailing ``` if present
                    cleanedData = cleanedData.replace(/```$/, '').trim()
                }
                jsonContent = JSON.parse(cleanedData)
            } catch {
                setError('Không parse được kết quả JSON!')
                return
            }
            setLcmChecklistResults(jsonContent)
            setIsProcessing(false)
        } catch (e: any) {
            setIsProcessing(false)
            setError('Lỗi: ' + (e?.message || e))
        }
    }

    const processContractText = () => {
        if (!contractText) return
        setIsProcessing(true)
        extractContractInfo(contractText, setContractImportantText, () => {
            setIsProcessing(false)
        })
        handlePreviewContract(
            contractText,
            (content) => {
                setPreviewDialog({ open: true, content, title: 'Contract Preview' })
            },
            () => {
                setIsProcessing(false)
            },
        )
    }

    return {
        contractFile,
        setContractFile,
        lcmFile,
        setLcmFile,
        contractText,
        setContractText,
        lcmChecklist,
        setLcmChecklist,
        isProcessing,
        setIsProcessing,
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
        handleContractDrop,
        handleLcmDrop,
        processContractText,
        handleAnalyzeChecklist,
    }
}
