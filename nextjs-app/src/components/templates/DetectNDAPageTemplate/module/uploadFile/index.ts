/* eslint-disable @typescript-eslint/no-explicit-any */
import apiHandler from '@/shared/utils/apiHandler'

export async function uploadFile(
    contract: {
        file: File
        contractAnalystResults: { contractResult: any | null; checklistResult: any[] | null }
        status: string
    },
    onSuccess: (msg: string) => void,
    onError: (msg: string) => void,
    setUploading: (v: boolean) => void,
) {
    setUploading(true)
    onError('')
    try {
        const stringifychecklistResult = JSON.stringify(
            contract.contractAnalystResults.checklistResult,
        )
        const stringifyContractResult = JSON.stringify(
            contract.contractAnalystResults.contractResult,
        )
        // Upload file (multipart/form-data)
        const formData = new FormData()
        formData.append('file', contract.file)
        const uploadRes = await apiHandler({
            method: 'POST',
            url: '/api/contract/upload',
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        // After upload, save results (application/json)
        if (uploadRes && uploadRes.contract && uploadRes.contract._id) {
            await apiHandler({
                method: 'POST',
                url: '/api/contract/save-results',
                data: {
                    contractId: uploadRes.contract._id,
                    contractAnalystResults: {
                        contractResult: stringifyContractResult,
                        checklistResult: stringifychecklistResult,
                    },
                    status: contract.status,
                },
                onSuccess,
                onError,
                setLoading: setUploading,
                successMessage: 'File uploaded and results saved successfully!',
                errorMessage: 'Save results failed',
            })
        } else {
            throw new Error('Upload succeeded but contract ID not returned')
        }
    } catch (err: unknown) {
        const msg =
            err && typeof err === 'object' && 'message' in err
                ? (err as { message: string }).message
                : String(err)
        onError(msg || 'Upload failed')
        setUploading(false)
    }
}
