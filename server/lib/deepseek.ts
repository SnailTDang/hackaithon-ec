// This module is for server-side (Fastify) use only. Do NOT import in Next.js frontend code.
import OpenAI from 'openai'

const key = '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'

const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: key || '<DeepSeek API Key>',
})

export default openai
