/* eslint-disable @typescript-eslint/no-explicit-any */
import apiHandler from '@/shared/utils/apiHandler'

export async function uploadFile(
    contract: {
        file: File
        contractAnalystResults: { contractResult: any; checklistResult: any[] }
    },
    onSuccess: (msg: string) => void,
    onError: (msg: string) => void,
    setUploading: (v: boolean) => void,
) {
    const formData = new FormData()
    formData.append('file', contract.file)
    formData.append('contractName', contract.file.name)
    formData.append('hightlighted', '')
    await apiHandler({
        method: 'POST',
        url: '/api/contract/upload',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
        onSuccess,
        onError,
        setLoading: setUploading,
        successMessage: 'File uploaded successfully!',
        errorMessage: 'Upload failed',
    })
}
