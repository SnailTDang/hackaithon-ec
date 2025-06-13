/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FastifyRequest, FastifyReply } from 'fastify'
import openai from '../../../lib/deepseek'

// POST /api/analyze-contract
export async function deepseekChatHandler(req: FastifyRequest, reply: FastifyReply) {
    try {
        // Debug: log full request info
        req.log.info(
            { method: req.method, url: req.url, headers: req.headers },
            '[DeepSeek] Incoming request',
        )
        // @ts-ignore
        req.log.info({ body: req.body }, '[DeepSeek] Request body')
        const { messages, model = 'deepseek/deepseek-r1-0528:free' } = req.body as any
        if (!messages || !Array.isArray(messages)) {
            req.log.error('[DeepSeek] Error: messages array is required')
            return reply.code(400).send({ error: 'messages array is required' })
        }
        const response = await openai.chat.completions.create({
            model,
            messages,
        })
        req.log.info({ response }, '[DeepSeek] Outgoing response')
        reply.send(response)
    } catch (error: any) {
        req.log.error({ err: error }, '[DeepSeek] Error')
        if (error.stack) req.log.error({ stack: error.stack })
        reply.code(500).send({ error: error.message })
    }
}
