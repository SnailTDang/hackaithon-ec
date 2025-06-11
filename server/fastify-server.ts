/* eslint-disable @typescript-eslint/no-explicit-any */
import 'dotenv/config'
import Fastify from 'fastify'
import path from 'path'
import pino from 'pino'
import { registerAllPlugins } from './src/pulgins/registerAllPlugins'

const logFilePath = path.join(__dirname, 'server.log')
const logStream = pino.destination({ dest: logFilePath, sync: false })

const fastify = Fastify({ logger: { stream: logStream } })

registerAllPlugins(fastify)

// Set CSP header for all responses (for Next.js dev compatibility)
fastify.addHook('onSend', async (request, reply) => {
    reply.header('Content-Security-Policy', "script-src 'self' 'unsafe-eval'")
})

fastify.addHook('onRequest', async (request, _reply) => {
    request.log = fastify.log
})

fastify.listen({ port: 3000, host: '0.0.0.0' }, (err: any, address: string) => {
    if (err) {
        console.error('Fastify failed to start:', err)
        throw err
    }
    console.log(`> Fastify ready on ${address}`)
    fastify.log.info(`> Fastify ready on ${address}`)
})
