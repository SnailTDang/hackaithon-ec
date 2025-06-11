import { FastifyRequest, FastifyReply } from 'fastify'
import { ContractModel } from '../../models/contract'

// GET /api/contract/:id
export default async function getContractHandler(req: FastifyRequest, res: FastifyReply) {
    try {
        const contractId = (req.params as { id?: string }).id
        if (!contractId) {
            return res.status(400).send({ error: 'Contract ID is required' })
        }
        const contract = await ContractModel.findById(contractId)
        if (!contract) {
            return res.status(404).send({ error: 'Contract not found' })
        }
        return res.status(200).send({ contract })
    } catch (error) {
        const errMsg =
            error && typeof error === 'object' && 'message' in error
                ? (error as { message: string }).message
                : String(error)
        req.log.error({ error: errMsg }, 'Failed to get contract')
        return res.status(500).send({ error: 'Failed to get contract', details: errMsg })
    }
}
