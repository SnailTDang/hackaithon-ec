/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import axios from 'axios'
import { tryNormalizeSections } from '../tryNormalizeSections'
import { API_KEY, MAIN_PROMPT, MAIN_PROMPT_DELIVERY } from '../constants'
import { readFileText } from '../readFileText'
import { generateDocxFile } from '../generateDocxFile'

export const useNDAAnalyzerTemplate = () => {
    const [file, setFile] = useState<File | null>(null)
    const [sections, setSections] = useState<{ title: string; content: string }[] | null>(null)
    const [docUrl, setDocUrl] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const AnalyzeFn = async (promptData: string) => {
        try {
            const response = await axios.post('/api/analyze-contract', {
                model: 'deepseek/deepseek-r1-0528:free',
                messages: [{ role: 'user', content: promptData }],
            })
            const content = response.data.choices?.[0]?.message?.content || ''
            let outSections: { title: string; content: string }[] | null = null
            outSections = tryNormalizeSections(content)
            if (!outSections) {
                outSections = [{ title: 'Báo cáo', content }]
            }
            return outSections
        } catch {
            return null
        }
    }

    const handleAnalyze = async () => {
        if (!file || !API_KEY) return
        setLoading(true)
        setError(null)
        setSections(null)
        setDocUrl(null)
        try {
            const fileText = await readFileText(file)
            const promptDelivery = MAIN_PROMPT_DELIVERY + '\n\n' + fileText
            const prompt = MAIN_PROMPT + '\n\n' + fileText
            const data1 = await AnalyzeFn(promptDelivery)
            const data2 = await AnalyzeFn(prompt)
            let outSections: { title: string; content: string }[] = []
            if (data1 && Array.isArray(data2)) {
                outSections = [data1[0], ...data2]
            } else if (data1) {
                outSections = [data1[0]]
            } else if (Array.isArray(data2)) {
                outSections = data2
            }
            setSections(outSections)
            await generateDocxFile(outSections)
        } catch {
            setError('Có lỗi khi phân tích hoặc gọi API.')
        }
        setLoading(false)
    }

    return {
        file,
        setFile,
        sections,
        setSections,
        docUrl,
        setDocUrl,
        loading,
        setLoading,
        error,
        setError,
        handleAnalyze,
        apiKey: API_KEY,
    }
}
