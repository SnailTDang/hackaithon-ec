/* eslint-disable @typescript-eslint/no-explicit-any */
import { pipeline } from 'stream/promises'
import { FastifyRequest, FastifyReply } from 'fastify'
import fs from 'fs'
import path from 'path'
import { ContractModel } from '../../models/contract'
import { uid } from 'uid'
import mapFileType from '../../shared/utils/mapFileType'

const SERVER_URL = 'http://localhost:3000/'

// Helper type guard for req.file
function hasFileMethod(req: any): req is { file: () => Promise<any> } {
    return typeof req.file === 'function'
}

// NOTE: Make sure @fastify/multipart is registered in your Fastify server for file uploads to work.
// Example: fastify.register(require('@fastify/multipart'))

export default async function uploadContractHandler(
    req: FastifyRequest, // Remove manual log typing, now handled globally
    res: FastifyReply,
) {
    console.log('Incoming contract upload request:', req.method, req.url)
    req.log.info(
        { headers: req.headers, method: req.method, url: req.url },
        'Incoming contract upload request',
    )
    // Check for multipart/form-data content-type
    if (
        !req.headers['content-type'] ||
        !req.headers['content-type'].includes('multipart/form-data')
    ) {
        console.error('Unsupported Media Type:', req.headers['content-type'])
        req.log.error('Unsupported Media Type: ' + req.headers['content-type'])
        return res
            .status(415)
            .send({ error: 'Unsupported Media Type. Use multipart/form-data for file upload.' })
    }
    try {
        // Get the uploaded file (Fastify multipart)
        if (!hasFileMethod(req)) {
            console.error('File upload not supported on this route')
            return res.status(400).send({ error: 'File upload not supported on this route' })
        }
        const file = await req.file()
        if (!file) {
            console.error('No file provided in request')
            req.log.error('No file provided in request')
            return res.status(400).send({ error: 'File is required (pdf or docx)' })
        }
        console.log('Received file:', file.filename, file.mimetype)
        req.log.info({ filename: file.filename, mimetype: file.mimetype }, 'Received file')

        // Extract fields from req.body (cast to Record<string, any>)
        let hightlighted = ''
        if (typeof req.body === 'object' && req.body !== null) {
            hightlighted = (req.body as any).hightlighted || ''
        } else if (typeof file.fields === 'object' && file.fields !== null) {
            // Fastify multipart: fields are available on file.fields as Multipart or Multipart[]
            const getFieldValue = (field: any) => {
                if (Array.isArray(field)) {
                    return field[0]?.value || ''
                } else if (field && typeof field === 'object' && 'value' in field) {
                    return field.value || ''
                }
                return ''
            }
            hightlighted = getFieldValue(file.fields.hightlighted)
        }

        // Generate a unique filename: contractId_timespan.ext
        const ext = path.extname(file.filename)
        const timespan = Date.now()
        // Use uid for a unique, valid ID for the filename
        const randomId = uid(10)
        const filename = `contract_${randomId}_${timespan}${ext}`
        const uploadsDir = path.join(process.cwd(), 'uploads')
        const filePath = path.join(uploadsDir, filename)
        const writeStream = fs.createWriteStream(filePath)
        await pipeline(file.file, writeStream)
        console.log('File saved to disk:', filePath)
        req.log.info({ filePath }, 'File saved to disk')

        // Prepare file info for DB (common file model)
        // Helper function to map file mimetype/extension to main type

        const fileType = mapFileType(file.mimetype, file.filename)

        const fileInfo = {
            originalName: file.filename,
            storedName: filename,
            path: `/uploads/${filename}`,
            url: `${SERVER_URL}uploads/${filename}`,
            size: file.file.bytesRead || null,
            mimetype: file.mimetype,
            type: fileType,
            uploadedAt: new Date(),
        }

        // Save contract to DB after file is saved
        const tempContract = await ContractModel.create({
            contractName: file.filename || 'Untitled',
            hightlighted: hightlighted || '',
            file: fileInfo,
        })
        console.log('Contract created successfully:', tempContract._id)
        req.log.info({ contractId: tempContract._id }, 'Contract created successfully')

        // Send success response
        return res.status(201).send({
            message: 'Contract created successfully',
            contract: tempContract,
        })
    } catch (error) {
        const errMsg =
            error && typeof error === 'object' && 'message' in error
                ? (error as { message: string }).message
                : String(error)
        console.error('Failed to save contract:', errMsg)
        req.log.error({ error: errMsg }, 'Failed to save contract')
        console.log({ error })
        return res.status(500).send({ error: 'Failed to save contract', details: errMsg })
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
}
