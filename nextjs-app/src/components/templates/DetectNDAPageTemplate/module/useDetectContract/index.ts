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
import { buildPromptChecklist } from '@/shared/constants/prompts'
import axios from 'axios'
import { useRouter } from 'next/navigation'

type ChecklistRow = {
    item: string
    standard: string
    frequency: string
}

export type UseDetectContractReturn = {
    tabResult: number
    handleChangeTab: (tab: number) => void
    contractFile: File | null
    setContractFile: React.Dispatch<React.SetStateAction<File | null>>
    lcmFile: File | null
    setLcmFile: React.Dispatch<React.SetStateAction<File | null>>
    contractText: string
    setContractText: React.Dispatch<React.SetStateAction<string>>
    lcmChecklist: string
    setLcmChecklist: React.Dispatch<React.SetStateAction<string>>
    isProcessing: boolean
    setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>
    error: string
    setError: React.Dispatch<React.SetStateAction<string>>
    contractImportantText: any[] | null
    setContractImportantText: React.Dispatch<React.SetStateAction<any[] | null>>
    lcmChecklistResults: any[]
    setLcmChecklistResults: React.Dispatch<React.SetStateAction<any[]>>
    previewDialog: {
        open: boolean
        file: File | null
        content: string | null
        title: string
    }
    setPreviewDialog: React.Dispatch<
        React.SetStateAction<{
            open: boolean
            content: string | null
            file: File | null
            title: string
        }>
    >
    uploadError: string
    setUploadError: React.Dispatch<React.SetStateAction<string>>
    uploadSuccess: string
    setUploadSuccess: React.Dispatch<React.SetStateAction<string>>
    handleUploadContract: (file: File) => void
    handleContractDrop: (file: File) => Promise<void>
    processContractText: () => void
    handleAnalyzeChecklist: () => Promise<void>
    onContractDelete: () => void
    onLcmDelete: () => void
    handleSaveButton: () => void
    handleDownloadExcel: () => void
    handleDownloadWordReport: () => void
}

export const useDetectContract = (): UseDetectContractReturn => {
    const router = useRouter()
    const [contractFile, setContractFile] = useState<File | null>(null)
    const [lcmFile, setLcmFile] = useState<File | null>(null)
    const [contractText, setContractText] = useState('')
    const [lcmChecklist, setLcmChecklist] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState('')
    const [contractImportantText, setContractImportantText] = useState<any[] | null>(null)
    const [lcmChecklistResults, setLcmChecklistResults] = useState<any[]>([])
    const [previewDialog, setPreviewDialog] = useState<{
        open: boolean
        file: File | null
        content: string | null
        title: string
    }>({ open: false, content: null, file: null, title: '' })
    const [uploadError, setUploadError] = useState('')
    const [uploadSuccess, setUploadSuccess] = useState('')
    const [checklistRows, setChecklistRows] = useState<any[][]>([])
    const [tabResult, setTabResult] = useState(0)

    const handleChangeTab = (newValue: number) => {
        setTabResult(newValue)
    }

    const onContractDelete = () => {
        setContractFile(null)
        setContractText('')
        setContractImportantText(null)
    }

    const onLcmDelete = () => {
        setLcmFile(null)
        setLcmChecklist('')
        setLcmChecklistResults([])
    }

    const handleUploadContract = (file: File) => {
        if (file) {
            const data = {
                file: file,
                contractAnalystResults: {
                    contractResult: contractImportantText || null,
                    checklistResult: lcmChecklistResults.length ? lcmChecklistResults : null,
                },
            }

            console.log(lcmChecklistResults)

            console.log(file)
            setContractFile(file)

            setUploadError('')
            setUploadSuccess('')
            uploadFile(
                data,
                (msg) => {
                    setUploadSuccess(msg)
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

    const handleSaveButton = () => {
        if (!contractFile) return
        const data = {
            file: contractFile,
            contractAnalystResults: {
                contractResult: contractImportantText || null,
                checklistResult: lcmChecklistResults.length ? lcmChecklistResults : null,
            },
        }

        uploadFile(
            data,
            (msg) => {
                setUploadSuccess(msg)
                router.push('/nda-manager')
            },
            (msg) => setUploadError(msg),
            setIsProcessing,
        )
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

    const parseChecklistExcel = (arrayBuffer: ArrayBuffer): ChecklistRow[] => {
        const workbook = XLSX.read(arrayBuffer, { type: 'array' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const json: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 })

        // const headers = (json[0] || []).map((h: any) => (h || '').toLowerCase())
        const headers = (json[2] || []).map((h: any) => (h || '').toLowerCase())
        const idxItem = headers.findIndex((v: string) => v.includes('item'))
        const idxStandard = headers.findIndex((v: string) => v.includes('standard'))
        const idxFreq = headers.findIndex((v: string) => v.includes('frequency'))
        setChecklistRows(json)
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
        if (!contractText || !lcmFile) {
            setError('Vui lòng chọn đủ 2 file')
            return
        }
        try {
            setError('')
            setLcmChecklistResults([])
            setIsProcessing(true)
            handleChangeTab(1)
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
                let cleanedData = content
                if (typeof cleanedData === 'string') {
                    cleanedData = cleanedData.replace(/^```json|^```/i, '').trim()
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
            setError('Lỗi: ' + (e?.message || e))
        } finally {
            setIsProcessing(false)
        }
    }

    const processContractText = async () => {
        if (!contractText) return
        handleChangeTab(0)
        setIsProcessing(true)
        extractContractInfo(contractText, setContractImportantText, () => {
            setIsProcessing(false)
        })
        handlePreviewContract(
            contractText,
            (content) => {
                console.log(content)
                setPreviewDialog({
                    open: true,
                    content: content[0].content,
                    file: null,
                    title: 'Contract Preview',
                })
            },
            () => {
                setIsProcessing(false)
            },
        )
    }

    const handleDownloadWordReport = () => {
        console.log(lcmChecklistResults)
        if (!lcmChecklistResults.length) return

        // Phần 1: Missing Terms
        const missing = lcmChecklistResults.filter(
            (r) =>
                !r.found_text ||
                r.found_text.trim() === '' ||
                r.found_text.toLowerCase().includes('không tìm thấy'),
        )

        let html = `
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body, table, th, td, div, span {
                font-family: Arial, 'Segoe UI', Calibri, 'Liberation Sans', 'DejaVu Sans', sans-serif;
                font-size: 16px;
            }
            table { border-collapse: collapse; }
            th, td { padding: 8px 14px; }
        </style>
    </head>
    <body>
    <h2>Missing Terms</h2>
    <table border="1" cellpadding="6" style="margin-bottom:30px">
        <tr>
            <th>Item</th>
            <th>Standard</th>
            <th>Suggest</th>
        </tr>`

        missing.forEach((row) => {
            html += `<tr>
            <td>${row.item}</td>
            <td>${row.standard}</td>
            <td>${row.suggest || ''}</td>
        </tr>`
        })
        html += `</table>`

        // Phần 2: Detail Contract (tô màu đoạn found_text trong hợp đồng)
        let markedContract = contractText
        const alreadyMarked = new Set<string>()
        lcmChecklistResults
            .filter(
                (r) =>
                    r.found_text &&
                    r.found_text.trim() !== '' &&
                    !r.found_text.toLowerCase().includes('không tìm thấy'),
            )
            .sort((a, b) => (a.review_result === 'NOK' ? -1 : 1))
            .forEach((row) => {
                const cleanFound = row.found_text.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1')
                if (alreadyMarked.has(cleanFound)) return
                alreadyMarked.add(cleanFound)
                if (row.review_result === 'NOK') {
                    markedContract = markedContract.replace(
                        new RegExp(cleanFound, 'g'),
                        `<span style="background-color:#ff6666; color:#222;">${row.found_text}</span>` +
                            (row.suggest
                                ? `<span style="color:#c00; font-style:italic;"> (Suggest: ${row.suggest})</span>`
                                : ''),
                    )
                } else if (row.review_result === 'OK') {
                    markedContract = markedContract.replace(
                        new RegExp(cleanFound, 'g'),
                        `<span style="background-color:#fff666;">${row.found_text}</span>`,
                    )
                }
            })

        html += `<h2>Detail Contract</h2><div style="white-space:pre-wrap; font-size:16px;">${markedContract}</div>`
        html += `</body></html>`

        // Xuất file
        const blob = new Blob([html], { type: 'application/msword' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'contract_review_report.doc'
        a.click()
        setTimeout(() => URL.revokeObjectURL(url), 1000)
    }

    const handleDownloadExcel = () => {
        if (!lcmChecklistResults || !lcmChecklistResults.length || !checklistRows.length) return

        // Tạo bản sao (deep clone) để không ảnh hưởng state
        const outRows = checklistRows.map((row) => [...row])
        if (!outRows.length) return

        // Xác định chỉ số cột item (tìm gần đúng từ header)
        const headerRow = outRows[0].map((h: any) => (h || '').toLowerCase())
        const idxItem = headerRow.findIndex((v: string) => v.includes('item'))
        // Xác định cột review_result (tự thêm nếu chưa có)
        let rrIdx = headerRow.findIndex((v: string) => v.includes('review result'))
        if (rrIdx === -1) {
            outRows[0].push('Review Result')
            rrIdx = outRows[0].length - 1
        }

        // Duyệt từng dòng checklist (bỏ header)
        for (let i = 1; i < outRows.length; ++i) {
            const itemCell = (outRows[i][idxItem] || '').toString().trim()
            // Tìm review theo item (nếu nhiều item trùng nhau thì map đúng thứ tự)
            const review = lcmChecklistResults.find((r) => r.item?.trim() === itemCell)
            outRows[i][rrIdx] = review?.review_result || ''
        }

        // Ghi file Excel
        const wb = XLSX.utils.book_new()
        const ws = XLSX.utils.aoa_to_sheet(outRows)
        XLSX.utils.book_append_sheet(wb, ws, 'Review')
        XLSX.writeFile(wb, 'contract_checklist_with_review.xlsx')
    }

    return {
        tabResult,
        contractFile,
        lcmFile,
        contractText,
        lcmChecklist,
        isProcessing,
        error,
        contractImportantText,
        lcmChecklistResults,
        previewDialog,
        uploadError,
        uploadSuccess,
        handleChangeTab,
        setContractFile,
        setLcmFile,
        setContractText,
        setLcmChecklist,
        setIsProcessing,
        setError,
        setContractImportantText,
        setLcmChecklistResults,
        setPreviewDialog,
        setUploadError,
        setUploadSuccess,
        handleUploadContract,
        handleContractDrop,
        processContractText,
        handleAnalyzeChecklist,
        onContractDelete,
        onLcmDelete,
        handleSaveButton,
        handleDownloadExcel,
        handleDownloadWordReport,
    }
}
