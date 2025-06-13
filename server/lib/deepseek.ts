// This module is for server-side (Fastify) use only. Do NOT import in Next.js frontend code.
import OpenAI from 'openai'

const key = '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'

const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: key || '<DeepSeek API Key>',
})

export default openai
