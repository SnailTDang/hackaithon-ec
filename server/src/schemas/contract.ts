import { z } from 'zod'

export const fileSchema = z.object({
    originalName: z.string().min(1, 'Original file name is required'),
    storedName: z.string().min(1, 'Stored file name is required'),
    path: z.string().min(1, 'File path is required'),
    url: z.string().url('File URL must be valid'),
    size: z.number().nullable(),
    mimetype: z.string().min(1, 'MIME type is required'),
    uploadedAt: z.union([z.string(), z.date()]), // Accept both string and Date for compatibility
})

export const contractSchema = z.object({
    contractName: z.string().min(1, 'contract name is required'),
    file: fileSchema,
    // hightlighted: z.string().min(0), // Optional or empty allowed
})

export type TFileInfo = z.infer<typeof fileSchema>
export type TContract = z.infer<typeof contractSchema>
