/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import * as XLSX from 'xlsx'
import mammoth from 'mammoth'
import { readAsText } from 'promise-file-reader'
import axios from 'axios'
import { buildPromptChecklist } from '@/shared/constants/prompts'

type ChecklistRow = {
    item: string
    standard: string
    frequency: string
}

type ReviewRow = {
    item: string
    standard: string
    frequency: string
    found_text: string
    review_result: 'OK' | 'NOK' | 'null' | null
    suggest: string
}

export type UseNDAChecklistReturn = {
    fullContractText: string
    contractFile: File | null
    checklistFile: File | null
    loading: boolean
    result: any[]
    error: string
    checklistRows: any[][]
    handleContractUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleChecklistUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleAnalyze: () => Promise<void>
    handleDownloadWordReport: () => void
    handleDownloadExcel: () => void
    setContractFile: React.Dispatch<React.SetStateAction<File | null>>
    setChecklistFile: React.Dispatch<React.SetStateAction<File | null>>
    setResult: React.Dispatch<React.SetStateAction<any[]>>
    setError: React.Dispatch<React.SetStateAction<string>>
}

export function useNDAChecklist(): UseNDAChecklistReturn {
    const [fullContractText, setFullContractText] = useState<string>('')
    const [contractFile, setContractFile] = useState<File | null>(null)
    const [checklistFile, setChecklistFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any[]>([])
    const [error, setError] = useState<string>('')
    const [checklistRows, setChecklistRows] = useState<any[][]>([])

    const handleContractUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContractFile(e.target.files?.[0] ?? null)
    }

    const parseChecklistExcel = (arrayBuffer: ArrayBuffer): ChecklistRow[] => {
        const workbook = XLSX.read(arrayBuffer, { type: 'array' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const json: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 })

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

    const handleChecklistUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null
        setChecklistFile(file)
        if (file) {
            file.arrayBuffer().then((arrBuf) => {
                const wb = XLSX.read(arrBuf, { type: 'array' })
                const sheet = wb.Sheets[wb.SheetNames[0]]
                const json: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 })
                setChecklistRows(json)
            })
        }
    }

    async function extractContractText(file: File): Promise<string> {
        if (file.name.endsWith('.docx')) {
            const arrayBuffer = await file.arrayBuffer()
            const { value } = await mammoth.extractRawText({ arrayBuffer })
            return value
        } else if (file.name.endsWith('.pdf')) {
            return '[PDF parsing not implemented in this demo]'
        } else {
            return await readAsText(file)
        }
    }

    async function handleAnalyze() {
        setError('')
        setResult([])
        if (!contractFile || !checklistFile) {
            setError('Vui lòng chọn đủ 2 file')
            return
        }
        setLoading(true)
        try {
            const contractText = await extractContractText(contractFile)
            setFullContractText(contractText)
            const checklistArrayBuffer = await checklistFile.arrayBuffer()
            const checklist = parseChecklistExcel(checklistArrayBuffer)
            const checklistTable = checklist
                .map(
                    (r: any, i: number) =>
                        `${i + 1}. Item: ${r.item}\nStandard terms & conditions: ${r.standard}\nFrequency of Terms in the NDA: ${r.frequency}`,
                )
                .join('\n')
            const prompt = buildPromptChecklist(contractText, checklistTable)
            const res = await axios.post('/api/analyze-contract', {
                model: 'deepseek/deepseek-r1-0528:free',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.1,
            })
            const content = res.data.choices?.[0]?.message?.content ?? ''
            let output: any[] = []
            try {
                output = JSON.parse(content)
            } catch {
                setError('Không parse được kết quả JSON!')
                setLoading(false)
                return
            }
            setResult(output)
        } catch (e: any) {
            setError('Lỗi: ' + (e?.message || e))
        }
        setLoading(false)
    }

    function handleDownloadWordReport() {
        if (!result.length) return

        // Phần 1: Missing Terms
        const missing = result.filter(
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

        for (const row of missing) {
            html += `<tr>
            <td>${row.item}</td>
            <td>${row.standard}</td>
            <td>${row.suggest || ''}</td>
        </tr>`
        }
        html += `</table>`

        // Phần 2: Detail Contract (tô màu đoạn found_text trong hợp đồng)
        let markedContract = fullContractText
        const alreadyMarked = new Set<string>()
        result
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

    function handleDownloadExcel() {
        if (!result.length || !checklistRows.length) return

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
            const review = result.find((r) => r.item.trim() === itemCell)
            outRows[i][rrIdx] = review?.review_result || ''
        }

        // Ghi file Excel
        const wb = XLSX.utils.book_new()
        const ws = XLSX.utils.aoa_to_sheet(outRows)
        XLSX.utils.book_append_sheet(wb, ws, 'Review')
        XLSX.writeFile(wb, 'contract_checklist_with_review.xlsx')
    }

    return {
        fullContractText,
        contractFile,
        checklistFile,
        loading,
        result,
        error,
        checklistRows,
        handleContractUpload,
        handleChecklistUpload,
        handleAnalyze,
        handleDownloadWordReport,
        handleDownloadExcel,
        setContractFile,
        setChecklistFile,
        setResult,
        setError,
    }
}
