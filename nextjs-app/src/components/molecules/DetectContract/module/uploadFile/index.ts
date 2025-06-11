import axios from 'axios'

export async function uploadFile(
    file: File,
    onSuccess: (msg: string) => void,
    onError: (msg: string) => void,
    setUploading: (v: boolean) => void,
) {
    setUploading(true)
    onError('')
    onSuccess('')
    try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('contractName', file.name)
        formData.append('hightlighted', '')
        await axios.post('/api/contract/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        onSuccess('File uploaded successfully!')
    } catch (err: unknown) {
        const msg =
            err && typeof err === 'object' && 'message' in err
                ? (err as { message: string }).message
                : String(err)
        onError(msg || 'Upload failed')
    } finally {
        setUploading(false)
    }
}
