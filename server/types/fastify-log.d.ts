import { FastifyLoggerInstance } from 'fastify'

// Extend FastifyRequest to include a properly typed `log` property

declare module 'fastify' {
    interface FastifyRequest {
        log: FastifyLoggerInstance
    }
}
