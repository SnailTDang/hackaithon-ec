// This module is for server-side (Fastify) use only. Do NOT import in Next.js frontend code.
import OpenAI from 'openai'

const key = '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'

const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: key || '<DeepSeek API Key>',
})

export default openai
