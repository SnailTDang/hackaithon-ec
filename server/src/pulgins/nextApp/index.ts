// import { Environment } from "common-main/src/const/Environment"
import plugin from 'fastify-plugin'
import next from 'next'
import path from 'path'
import { FastifyPluginCallback } from 'fastify'

const dev = true // Always run Next.js in dev mode, so no need to build nextjs-app
const app = next({ dev, dir: path.join(__dirname, '../../../../nextjs-app') })
const handle = app.getRequestHandler()

const nextAppPlugin: FastifyPluginCallback = (fastify, _opts, done) => {
    app.prepare()
        .then(() => {
            fastify.log.info('Next.js app prepared')

            fastify.get('/_next/*', (req, reply) => {
                handle(req.raw, reply.raw)
                reply.hijack()
            })

            fastify.all('/*', (req, reply) => {
                handle(req.raw, reply.raw)
                reply.hijack()
            })

            fastify.setNotFoundHandler((req, reply) => {
                app.render404(req.raw, reply.raw).then(() => reply.hijack())
            })

            fastify.addHook('onClose', () => app.close())
            fastify.log.info('Next.js plugin registered')
            done()
        })
        .catch((error: unknown) => {
            fastify.log.error({ error }, 'Next.js app prepare failed')
            if (error instanceof Error) {
                done(error)
            } else {
                done(new Error('Next.js app prepare failed'))
            }
        })
}

export const nextApp = plugin(nextAppPlugin)
