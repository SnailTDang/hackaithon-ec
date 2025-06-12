import mongoose, { Schema, Document } from 'mongoose'

export interface IFileInfo {
    originalName: string
    storedName: string
    path: string
    url: string
    size: number | null
    mimetype: string
    uploadedAt: string | Date // Accept both for compatibility with schema/controller
}

export interface IContract extends Document {
    contractName: string
    file: IFileInfo
    contractAnalystResults: IContractAnalystResults | null // Optional field
    createdAt?: Date
    updatedAt?: Date
    delFlg?: boolean
}

export interface IContractAnalystResults {
    contractResult: string
    checklistResult: string
}

const ContractAnalystResultsSchema: Schema = new Schema(
    {
        contractResult: { type: String, required: true },
        checklistResult: { type: String, required: true },
    },
    { _id: false },
)

const FileInfoSchema: Schema = new Schema(
    {
        originalName: { type: String, required: true },
        storedName: { type: String, required: true },
        path: { type: String, required: true },
        url: { type: String, required: true },
        size: { type: Number },
        mimetype: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['docx', 'pdf', 'image', 'other'],
        },
        uploadedAt: { type: Schema.Types.Mixed, required: true }, // Accept string or Date
    },
    { _id: false },
)

const ContractSchema: Schema = new Schema(
    {
        contractName: {
            type: String,
            required: [true, 'Contract name is required'],
        },
        file: {
            type: FileInfoSchema,
            required: [true, 'File info is required'],
        },
        contractAnalystResults: {
            type: ContractAnalystResultsSchema,
            required: false,
        },
    },
    {
        timestamps: true,
    },
)

export const ContractModel =
    mongoose.models.Contract || mongoose.model<IContract>('Contract', ContractSchema)
