import plugin from 'fastify-plugin'
import { FastifyInstance } from 'fastify'
import { handlers } from '../../handlers'
import { errorHandler } from './modules/errorsHandler'
import type { FastifyPluginAsync } from 'fastify'

const callback: FastifyPluginAsync = async (fastify: FastifyInstance) => {
    handlers.forEach(([method, path, handler]) => {
        fastify.route({
            method,
            url: path,
            handler,
        })
    })
    fastify.setErrorHandler(errorHandler)
    fastify.log.info('API routes registered successfully')
}

export const api = plugin(callback)
