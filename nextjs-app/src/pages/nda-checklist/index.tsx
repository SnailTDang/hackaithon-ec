/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useState } from 'react'
import * as XLSX from 'xlsx'
import mammoth from 'mammoth'
import { readAsText } from 'promise-file-reader'

function parseChecklistExcel(arrayBuffer: ArrayBuffer): ChecklistRow[] {
    const workbook = XLSX.read(arrayBuffer, { type: 'array' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const json: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 })

    const headers = (json[0] || []).map((h: any) => (h || '').toLowerCase())
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

const apiKey = 'xxxxx'

export default function Home() {
    const [fullContractText, setFullContractText] = useState<string>('')
    const [contractFile, setContractFile] = useState<File | null>(null)
    const [checklistFile, setChecklistFile] = useState<File | null>(null)
    // const [apiKey, setApiKey] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<ReviewRow[]>([])
    const [error, setError] = useState<string>('')
    const [checklistRows, setChecklistRows] = useState<any[][]>([]) // lưu thô từng dòng của file checklist gốc

    const handleContractUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContractFile(e.target.files?.[0] ?? null)
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
            // Build checklist content dạng bảng text cho prompt
            const checklistTable = checklist
                .map(
                    (r, i) =>
                        `${i + 1}. Item: ${r.item}\nStandard terms & conditions: ${r.standard}\nFrequency of Terms in the NDA: ${r.frequency}`,
                )
                .join('\n')

            // PROMPT: gộp mọi logic vào prompt, output JSON chuẩn
            const prompt = `
Bạn là chuyên gia kiểm tra hợp đồng pháp lý.  
Nhiệm vụ: Đối chiếu hợp đồng với checklist dưới đây và trả về duy nhất một mảng JSON.  
**Yêu cầu về JSON**:  
Mỗi phần tử (item) là một object với các trường như sau:

{
  "item": "",
  "standard": "",
  "frequency": "Yes|No",
  "found_text": "",                  // Đoạn văn bản liên quan nhất trong hợp đồng. Nếu không có, ghi rõ "Không tìm thấy trong hợp đồng."
  "review_result": "OK|NOK|Null",    // Đánh giá kết quả kiểm tra
  "suggest": ""                      // Phân tích rõ vì sao đạt/không đạt và gợi ý chỉnh sửa, ví dụ: “Đầy đủ tên, địa chỉ, người đại diện của các bên.”, “Thiếu quy định xác nhận lại bằng văn bản nếu tiết lộ miệng. thêm thông tin”
}

**Tiêu chí đánh giá:**
1. Nếu Frequency = Yes (bắt buộc phải có):
   - Nếu không có trong hợp đồng: review_result = "NOK", suggest = "Bổ sung điều khoản này vào hợp đồng."
   - Nếu có nhưng không khớp Standard terms & conditions: review_result = "NOK", suggest = "Chỉnh sửa cho đúng: ..." (ghi cụ thể theo thực tế)
   - Nếu có và khớp: review_result = "OK", suggest = ""
2. Nếu Frequency = No (không bắt buộc):
   - Nếu không có trong hợp đồng: review_result = Null, suggest = ""
   - Nếu có: so khớp ngữ nghĩa. Nếu khớp: "OK", nếu không: "NOK" (và suggest)
3. Nếu Standard terms & conditions = "Not mentioned":
   - Nếu tìm thấy trong hợp đồng: review_result = "NOK", suggest = "Xoá/loại bỏ điều khoản này khỏi hợp đồng."
   - Nếu không thấy: review_result = "OK" hoặc Null (tuỳ frequency), suggest = ""
   
**Bắt buộc:**
- "found_text" phải lấy đúng đoạn văn bản thực tế trong hợp đồng, ưu tiên đầy đủ nhất.
- "suggest" phải viết rõ vì sao lại đánh giá như vậy, sát với thực tế từng case (ví dụ: “Chỉ giới hạn tiết lộ cho người đã ký NDA, chưa đề cập trường hợp bắt buộc theo luật.”, “Điều khoản hiệu lực rõ ràng, đáp ứng yêu cầu checklist.” v.v.).
- Nếu NOK thì bắt buộc phải có suggest thực tế, cụ thể (nếu là thiếu thì ghi rõ cần bổ sung điều khoản nào, nếu lệch ngữ nghĩa thì ghi rõ nên chỉnh gì).

**Trả về**: Chỉ duy nhất một mảng JSON đúng structure trên. Không giải thích gì thêm ngoài JSON.

Checklist:
${checklistTable}

Nội dung hợp đồng:
${contractText}
`
            // Gọi API GPT (OpenRouter)
            const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.1,
                }),
            })
            const json = await res.json()
            const content = json.choices?.[0]?.message?.content ?? ''
            let output: ReviewRow[] = []
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

    return (
        <div
            style={{
                maxWidth: 1100,
                margin: '40px auto',
                padding: 24,
                fontFamily: 'Arial, sans-serif',
            }}
        >
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 16 }}>
                NDA Contract Auto Checker (AI)
            </h1>
            <div style={{ marginBottom: 16 }}>
                <label style={{ fontWeight: 600 }}>Contract file (Word, PDF, TXT): </label>
                <input type="file" accept=".docx,.pdf,.txt" onChange={handleContractUpload} />
            </div>
            <div style={{ marginBottom: 16 }}>
                <label style={{ fontWeight: 600 }}>Checklist file (.xlsx): </label>
                <input type="file" accept=".xlsx" onChange={handleChecklistUpload} />
            </div>
            {/* <div style={{ marginBottom: 16 }}>
                <label style={{ fontWeight: 600 }}>API Key: </label>
                <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    style={{ minWidth: 300, fontSize: 15 }}
                    placeholder="Your OpenRouter API Key"
                />
            </div> */}
            <button
                disabled={loading}
                style={{
                    background: '#1a73e8',
                    color: '#fff',
                    fontWeight: 600,
                    padding: '10px 36px',
                    borderRadius: 6,
                    border: 'none',
                    fontSize: 17,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    marginBottom: 28,
                }}
                onClick={handleAnalyze}
            >
                {loading ? 'Processing...' : 'Analyze'}
            </button>
            {result.length > 0 && (
                <button
                    style={{
                        background: '#43a047',
                        color: '#fff',
                        fontWeight: 600,
                        border: 'none',
                        padding: '10px 34px',
                        borderRadius: 6,
                        fontSize: 16,
                        cursor: 'pointer',
                        float: 'right',
                        marginTop: -42,
                        marginBottom: 20,
                    }}
                    onClick={handleDownloadWordReport}
                >
                    Download Word Report
                </button>
            )}
            {result.length > 0 && (
                <button
                    style={{
                        background: '#3b82f6',
                        color: '#fff',
                        fontWeight: 600,
                        border: 'none',
                        padding: '10px 34px',
                        borderRadius: 6,
                        fontSize: 16,
                        cursor: 'pointer',
                        float: 'right',
                        marginRight: 16,
                        marginTop: -42,
                        marginBottom: 20,
                    }}
                    onClick={handleDownloadExcel}
                >
                    Download Excel Report
                </button>
            )}

            {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
            {result.length > 0 && (
                <div style={{ overflowX: 'auto', marginTop: 32 }}>
                    <table
                        style={{
                            borderCollapse: 'collapse',
                            minWidth: 1050,
                            fontSize: 15,
                            background: '#fafaff',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        }}
                    >
                        <thead>
                            <tr>
                                <th style={thStyle}>#</th>
                                <th style={thStyle}>Item</th>
                                <th style={thStyle}>Standard</th>
                                <th style={thStyle}>Frequency</th>
                                <th style={thStyle}>Found Text</th>
                                <th style={thStyle}>Review Result</th>
                                <th style={thStyle}>Suggest</th>
                            </tr>
                        </thead>
                        <tbody>
                            {result.map((row, idx) => (
                                <tr
                                    key={idx}
                                    style={{ background: idx % 2 ? '#f1f4fa' : undefined }}
                                >
                                    <td style={tdStyle}>{idx + 1}</td>
                                    <td style={tdStyle}>{row.item}</td>
                                    <td style={tdStyle}>{row.standard}</td>
                                    <td style={{ ...tdStyle, fontWeight: 600 }}>{row.frequency}</td>
                                    <td
                                        style={{
                                            ...tdStyle,
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
                                            <mark style={{ background: '#fff666' }}>
                                                {row.found_text}
                                            </mark>
                                        ) : row.review_result === 'NOK' ? (
                                            <mark style={{ background: '#ff6666', color: '#222' }}>
                                                {row.found_text}
                                            </mark>
                                        ) : (
                                            row.found_text
                                        )}
                                    </td>
                                    <td
                                        style={{
                                            ...tdStyle,
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
                                    </td>
                                    <td style={{ ...tdStyle, color: '#c00' }}>
                                        {row.suggest || ''}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <style>
                {`
          th, td {
            border: 1px solid #ccd6e6;
            padding: 8px 12px;
            text-align: left;
            vertical-align: top;
          }
          th {
            background: #dde6fa;
          }
          table {
            width: 100%;
            margin-bottom: 30px;
          }
        `}
            </style>
        </div>
    )
}

const thStyle: React.CSSProperties = {
    border: '1px solid #ccd6e6',
    padding: '8px 12px',
    background: '#dde6fa',
    fontWeight: 700,
}

const tdStyle: React.CSSProperties = {
    border: '1px solid #ccd6e6',
    padding: '8px 12px',
    background: 'none',
    fontSize: 15,
}
