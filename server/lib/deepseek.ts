// This module is for server-side (Fastify) use only. Do NOT import in Next.js frontend code.
import OpenAI from 'openai'

const key = 'xxxxxxx'

const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: key || '<DeepSeek API Key>',
})

export default openai
