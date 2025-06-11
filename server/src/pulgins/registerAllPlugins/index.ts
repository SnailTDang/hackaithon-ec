import fastifyMultipart from '@fastify/multipart'
import fastifyMiddie from '@fastify/middie'
import fastifyHelmet from '@fastify/helmet'
import fastifyCookie from '@fastify/cookie'
import fastifySession from '@fastify/session'
import fastifyFormbody from '@fastify/formbody'
import connectToDatabase from '../../utils/connectToDatabase'
import { api } from '../api'
import { nextApp } from '../nextApp'

export const registerAllPlugins = (fastify) => {
    fastify.register(fastifyMultipart)
    fastify.register(connectToDatabase)
    fastify.register(fastifyMiddie)
    fastify.register(fastifyHelmet, {
        contentSecurityPolicy: {
            directives: {
                ...fastifyHelmet.contentSecurityPolicy.getDefaultDirectives(),
                'script-src': [
                    "'self'",
                    ...(process.env.NODE_ENV === 'development' ? ["'unsafe-eval'"] : []),
                ],
            },
        },
        crossOriginEmbedderPolicy: false,
    })
    fastify.register(fastifyCookie)
    fastify.register(fastifySession, {
        secret: 'a secret with minimum length of 32 characters',
        cookie: { secure: false },
    })
    fastify.register(fastifyFormbody)
    fastify.register(api)
    fastify.register(nextApp)
}
