/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyRequest, FastifyReply } from 'fastify'
import { ContractModel } from '../../models/contract'

export default async function deleteContractHandler(req: FastifyRequest, res: FastifyReply) {
    try {
        // Get contract IDs from params or body (support array or single)
        let contractIds: string[] = []
        if (Array.isArray((req.body as any)?.ids)) {
            contractIds = (req.body as any).ids.filter((id: any) => typeof id === 'string' && id)
        } else if ((req.body as any)?.id) {
            contractIds = [String((req.body as any).id)]
        } else if ((req.params as any)?.id) {
            contractIds = [String((req.params as any).id)]
        }
        // Remove duplicates and falsy values
        contractIds = Array.from(new Set(contractIds.filter(Boolean)))
        if (!contractIds.length) {
            return res.status(400).send({ error: 'Contract ID(s) required' })
        }
        // Find contracts in DB
        const contracts = await ContractModel.find({ _id: { $in: contractIds } })
        if (!contracts.length) {
            return res.status(404).send({ error: 'No contracts found for provided ID(s)' })
        }
        // Soft delete: set delFlg to true for all
        await ContractModel.updateMany({ _id: { $in: contractIds } }, { $set: { delFlg: true } })
        return res
            .status(200)
            .send({ message: 'Contract(s) deleted successfully', deleted: contractIds })
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : String(error)
        return res.status(500).send({ error: 'Failed to delete contract(s)', details: errMsg })
    }
}
