/* eslint-disable @typescript-eslint/no-explicit-any */
import mammoth from 'mammoth'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'

export const readFileText = async (file: File): Promise<string> => {
    if (file.name.endsWith('.docx')) {
        const buf = await file.arrayBuffer()
        const res = await mammoth.extractRawText({ arrayBuffer: buf })
        return res.value
    }

    if (file.name.endsWith('.pdf')) {
        const buf = await file.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data: buf }).promise
        let txt = ''
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i)
            const content = await page.getTextContent()
            txt += content.items.map((it: any) => it.str).join(' ') + '\n'
        }
        return txt
    }

    return await file.text()
}
