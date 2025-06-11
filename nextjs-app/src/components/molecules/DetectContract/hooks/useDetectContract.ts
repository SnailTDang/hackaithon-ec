import { useState, useEffect } from 'react'
import {
    extractTextFromLcm,
    extractTextFromImage,
    extractTextFromDocx,
    extractTextFromPdf,
    extractContractInfo,
    handlePreviewContract,
} from '../module/hanldeDetect'
import { uploadFile } from '../module/uploadFile'

export function useDetectContract() {
    const [contractFile, setContractFile] = useState<File | null>(null)
    const [lcmFile, setLcmFile] = useState<File | null>(null)
    const [contractText, setContractText] = useState('')
    const [lcmChecklist, setLcmChecklist] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState('')
    const [contractImportantText, setContractImportantText] = useState(null)
    const [lcmChecklistResults, setLcmChecklistResults] = useState<Record<string, unknown> | null>(
        null,
    )
    const [previewDialog, setPreviewDialog] = useState({ open: false, content: '', title: '' })
    const [uploadError, setUploadError] = useState('')
    const [uploadSuccess, setUploadSuccess] = useState('')

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
            // handleUploadContract(file)
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
        try {
            await extractTextFromLcm(file, setLcmChecklist)
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : String(err)
            setError(`Error processing LCM checklist file: ${errorMsg}`)
        } finally {
            setIsProcessing(false)
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

    // useEffect(() => {
    //     if (!contractImportantText || !lcmChecklist) return
    //     setIsProcessing(true)
    //     // extractChecklistComparison(
    //     //     contractImportantText,
    //     //     lcmChecklist,
    //     //     setLcmChecklistResults,
    //     //     () => {
    //     //         setIsProcessing(false)
    //     //     },
    //     // )
    // }, [contractImportantText, lcmChecklist])

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
    }
}
