import { FastifyRequest, FastifyReply } from 'fastify'
import path from 'path'
import fs from 'fs'

// GET /api/contract/download/:filename
export default async function downloadContractFileHandler(req: FastifyRequest, res: FastifyReply) {
    try {
        const filename = (req.params as { filename?: string }).filename
        if (!filename) {
            return res.status(400).send({ error: 'Filename is required' })
        }
        // Prevent directory traversal
        if (filename.includes('..') || filename.includes('/')) {
            return res.status(400).send({ error: 'Invalid filename' })
        }
        const uploadsDir = path.join(process.cwd(), 'uploads')
        const filePath = path.join(uploadsDir, filename)
        if (!fs.existsSync(filePath)) {
            return res.status(404).send({ error: 'File not found' })
        }
        res.header('Content-Disposition', `attachment; filename="${filename}"`)
        return res.send(fs.createReadStream(filePath))
    } catch (error) {
        const errMsg =
            error && typeof error === 'object' && 'message' in error
                ? (error as { message: string }).message
                : String(error)
        req.log.error({ error: errMsg }, 'Failed to download file')
        return res.status(500).send({ error: 'Failed to download file', details: errMsg })
    }
}
