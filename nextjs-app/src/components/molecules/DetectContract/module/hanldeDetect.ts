/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import Tesseract from 'tesseract.js'
import mammoth from 'mammoth'
import * as pdfjsLib from 'pdfjs-dist/build/pdf'
import { MAIN_PROMPT, MAIN_PROMPT_DELIVERY } from 'shared/constants/prompts'

// Ensure axios uses the same origin (port 3000) for API calls
axios.defaults.baseURL = ''

export const extractTextFromLcm = async (file: File, setLcmChecklist: (text: string) => void) => {
    const arrayBuffer = await file.arrayBuffer()
    const { value: text } = await mammoth.extractRawText({ arrayBuffer })
    setLcmChecklist(text)
}

export const extractTextFromImage = async (
    file: File,
    setContractText: (text: string) => void,
    setImage: (url: string) => void,
) => {
    setImage(URL.createObjectURL(file))
    const {
        data: { text },
    } = await Tesseract.recognize(file, 'eng')
    setContractText(text)
}

export const extractTextFromDocx = async (file: File, setContractText: (text: string) => void) => {
    const arrayBuffer = await file.arrayBuffer()
    const { value: text } = await mammoth.extractRawText({ arrayBuffer })
    setContractText(text)
}

export const extractTextFromPdf = async (file: File, setContractText: (text: string) => void) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
        if (!e.target || !e.target.result) {
            console.error('FileReader result is null')
            return
        }
        const pdfData = new Uint8Array(e.target.result as ArrayBuffer)
        const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise
        let extractedText = ''
        for (let i = 0; i < pdf.numPages; i++) {
            const page = await pdf.getPage(i + 1)
            const textContent = await page.getTextContent()
            extractedText += textContent.items.map((item: any) => item.str).join(' ') + '\n'
        }
        setContractText(extractedText)
    }
    reader.readAsArrayBuffer(file)
}

const AnalyzeContract = async (promptData: string) => {
    try {
        const response = await axios.post('/api/analyze-contract', {
            model: 'deepseek/deepseek-r1-0528:free',
            messages: [{ role: 'user', content: promptData }],
        })
        const content = response.data.choices?.[0]?.message?.content || ''
        return content
    } catch {
        return null
    }
}

export const extractContractInfo = async (
    contractText: string,
    setContractImportantText: (json: any) => void,
    showToast: (msg: string) => void,
) => {
    try {
        // const promptDelivery = MAIN_PROMPT_DELIVERY + '\n\n' + contractText
        const prompt = MAIN_PROMPT + '\n\n' + contractText
        const data = await AnalyzeContract(prompt)
        if (!data) {
            showToast('Failed to analyze contract')
            return
        }
        let jsonContent: any
        try {
            jsonContent = typeof data === 'string' ? JSON.parse(data) : data
        } catch (error) {
            console.error('Cannot parse contract analysis result to JSON:', error)
            showToast('Analysis result is not valid JSON')
            return
        }
        setContractImportantText(jsonContent)
        showToast('Contract analyzed')
    } catch (error) {
        console.error('Error extracting important contract information:', error)
    }
}

export const handlePreviewContract = async (
    contractText: string,
    setContractImportantText: (json: any) => void,
    showToast: (msg: string) => void,
) => {
    try {
        // const promptDelivery = MAIN_PROMPT_DELIVERY + '\n\n' + contractText
        const prompt = MAIN_PROMPT_DELIVERY + '\n\n' + contractText
        const data = await AnalyzeContract(prompt)
        if (!data) {
            showToast('Failed to analyze contract')
            return
        }
        let jsonContent: any
        try {
            jsonContent = typeof data === 'string' ? JSON.parse(data) : data
        } catch (error) {
            console.error('Cannot parse contract analysis result to JSON:', error)
            showToast('Analysis result is not valid JSON')
            return
        }
        setContractImportantText(jsonContent)
        showToast('Contract analyzed')
    } catch (error) {
        console.error('Error extracting important contract information:', error)
    }
}
