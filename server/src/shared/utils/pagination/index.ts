// server/utils/pagination/paginate.ts

interface PaginationParams {
    page?: string | number
    limit?: string | number
    total: number
}

export interface PaginationMeta {
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

export function getPaginationMeta({
    page = 1,
    limit = 10,
    total,
}: PaginationParams): PaginationMeta {
    const pageNum = Math.max(1, typeof page === 'string' ? parseInt(page, 10) || 1 : page)
    const limitNum = Math.max(
        1,
        Math.min(100, typeof limit === 'string' ? parseInt(limit, 10) || 10 : limit),
    )
    const skip = (pageNum - 1) * limitNum
    const totalPages = Math.ceil(total / limitNum)
    const hasNextPage = pageNum < totalPages
    const hasPrevPage = pageNum > 1

    return {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? pageNum + 1 : null,
        prevPage: hasPrevPage ? pageNum - 1 : null,
        startIndex: skip + 1,
        endIndex: Math.min(skip + limitNum, total),
    }
}
