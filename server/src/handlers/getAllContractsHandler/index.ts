/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyRequest, FastifyReply } from 'fastify'
import { ContractModel } from '../../models/contract'
import { getPaginationMeta } from '../../shared/utils/pagination'

// Query params interface for better type safety
interface QueryParams {
    page?: string
    limit?: string
    contractName?: string
    mimetype?: string
    from?: string
    to?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// GET /api/contract/all (get all contracts, paginated, with query params)
export default async function getAllContractsHandler(req: FastifyRequest, res: FastifyReply) {
    try {
        // Parse and validate query params
        const {
            page = '1',
            limit = '10',
            contractName = '',
            mimetype = '',
            from,
            to,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = req.query as QueryParams

        // Validate and sanitize pagination params
        const pageNum = Math.max(1, parseInt(page, 10) || 1)
        const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10)) // Cap at 100
        const skip = (pageNum - 1) * limitNum

        // Build filter object
        const filter: any = {}

        // Only include contracts that are not deleted (delFlg != true)
        filter.delFlg = { $ne: true }

        // Contract name search (case-insensitive)
        if (contractName && contractName.trim()) {
            filter.contractName = {
                $regex: contractName.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), // Escape regex chars
                $options: 'i',
            }
        }

        // Mimetype filter
        if (mimetype && mimetype.trim()) {
            filter['file.mimetype'] = mimetype.trim()
        }

        // Date range filter with validation
        if (from || to) {
            filter.createdAt = {}

            if (from) {
                const fromDate = new Date(from)
                if (isNaN(fromDate.getTime())) {
                    return res.status(400).send({
                        error: 'Invalid from date format. Use ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)',
                    })
                }
                filter.createdAt.$gte = fromDate
            }

            if (to) {
                const toDate = new Date(to)
                if (isNaN(toDate.getTime())) {
                    return res.status(400).send({
                        error: 'Invalid to date format. Use ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)',
                    })
                }
                // Set to end of day if only date is provided
                if (!to.includes('T')) {
                    toDate.setHours(23, 59, 59, 999)
                }
                filter.createdAt.$lte = toDate
            }

            // Validate date range
            if (from && to && filter.createdAt.$gte >= filter.createdAt.$lte) {
                return res.status(400).send({
                    error: 'From date must be earlier than to date',
                })
            }
        }

        // Build sort object
        const sortObject: any = {}
        const allowedSortFields = ['createdAt', 'updatedAt', 'contractName', 'fileSize', 'status']
        const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt'
        sortObject[sortField] = sortOrder === 'asc' ? 1 : -1
        if (sortField === 'fileSize') sortObject['file.size'] = sortOrder === 'asc' ? 1 : -1

        // Execute queries in parallel for better performance
        const [total, contracts] = await Promise.all([
            ContractModel.countDocuments(filter),
            ContractModel.find(filter).skip(skip).limit(limitNum).sort(sortObject).lean(), // Use lean() for better performance if you don't need Mongoose document methods
        ])

        // Calculate pagination metadata
        const pagination = getPaginationMeta({ page: pageNum, limit: limitNum, total })

        // Return response with comprehensive pagination info
        return res.status(200).send({
            success: true,
            contracts,
            pagination,
            filters: {
                contractName: contractName || null,
                mimetype: mimetype || null,
                from: from || null,
                to: to || null,
                sortBy: sortField,
                sortOrder,
            },
        })
    } catch (error) {
        // Enhanced error handling
        const errMsg = error instanceof Error ? error.message : String(error)

        req.log.error(
            {
                error: errMsg,
                stack: error instanceof Error ? error.stack : undefined,
                query: req.query,
            },
            'Failed to get all contracts',
        )

        return res.status(500).send({
            success: false,
            error: 'Failed to get all contracts',
            details: process.env.NODE_ENV === 'development' ? errMsg : 'Internal server error',
        })
    }
}
