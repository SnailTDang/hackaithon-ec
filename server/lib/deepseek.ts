// This module is for server-side (Fastify) use only. Do NOT import in Next.js frontend code.
import OpenAI from 'openai'

const key = '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'

const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: key || '<DeepSeek API Key>',
})

export default openai
