import { FastifyRequest, FastifyReply } from 'fastify'
import { ContractModel } from '../../models/contract'

export default async function saveResultsAnalystHandler(req: FastifyRequest, res: FastifyReply) {
    try {
        // Extract contractId and contractAnalystResults from body
        const { contractId, contractAnalystResults, status } = req.body as {
            contractId?: string
            contractAnalystResults?: {
                contractResult: string
                checklistResult: string
            }
            status: string
        }
        if (!contractId || !contractAnalystResults) {
            return res
                .status(400)
                .send({ error: 'contractId and contractAnalystResults are required' })
        }
        // Update contract with analyst results
        const updated = await ContractModel.findByIdAndUpdate(contractId, {
            contractAnalystResults,
            status: status ?? 'draft',
        })
        const contract = await ContractModel.findById(contractId)

        if (!updated) {
            return res.status(404).send({ error: 'Contract not found' })
        }
        return res.status(200).send({ message: 'Results saved', contract: contract })
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : String(error)
        return res.status(500).send({ error: 'Failed to save results', details: errMsg })
    }
}
