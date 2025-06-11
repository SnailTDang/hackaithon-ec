import path from 'path'

const mapFileType = (mimetype: string, filename: string): 'docx' | 'pdf' | 'image' | 'other' => {
    const ext = path.extname(filename).toLowerCase()
    console.log('mimetypehaha', mimetype, 'ext', ext)
    if (mimetype === 'application/pdf' || ext === '.pdf') {
        return 'pdf'
    }
    if (
        mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        ext === '.docx'
    ) {
        return 'docx'
    }
    if (
        mimetype.startsWith('image/') ||
        ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'].includes(ext)
    ) {
        return 'image'
    }
    return 'other'
}

export default mapFileType
