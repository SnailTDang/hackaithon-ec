// This module is for server-side (Fastify) use only. Do NOT import in Next.js frontend code.
import OpenAI from 'openai'

const key = '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'

const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: key || '<DeepSeek API Key>',
})

export default openai
