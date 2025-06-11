export type Contract = {
    _id: string
    contractName: string
    createdAt: string
    updatedAt?: string
    file: {
        filename: string
        mimetype: string
        size: number
        originalname: string
        type: 'docx' | 'pdf' | 'image' | 'other'
    }
}

export type PaginationMeta = {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
    nextPage: number | null
    prevPage: number | null
    startIndex: number
    endIndex: number
}

export type TableContentProps = {
    contracts: Contract[]
    pagination: PaginationMeta
    filters?: Record<string, unknown>
}

// Define Data type for table rows
export type Data = {
    index: number
    contractName: string
    createdAt: string
    type: string
    originalname: string
    size: number
}

// HeadCell type
export type HeadCell = {
    disablePadding: boolean
    id: keyof Data
    label: string
    numeric: boolean
}
