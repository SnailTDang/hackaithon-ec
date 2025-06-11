import { FastifyRequest, FastifyReply } from 'fastify'
import { userSchema } from '../../schemas/user'
import user from '../../models/user'

// This handler expects a Fastify plugin to have already connected to the database
// and made the connection available on the Fastify instance (e.g., fastify.mongo or custom plugin)

export default async function handler(req: FastifyRequest, res: FastifyReply) {
    const { method, body } = req

    if (method === 'POST') {
        const parsed = userSchema.safeParse(body)

        if (!parsed.success) {
            return res.status(400).send({
                error: 'Invalid request body',
                details: parsed.error.flatten(),
            })
        }

        try {
            // Database connection should be available via Fastify plugin
            // Example: await req.server.mongo.db.collection('users')
            // For Mongoose, models are globally registered after connection

            const foundUser = await user.findOne({ username: parsed.data.username })

            if (foundUser) {
                return res.status(201).send({
                    message: 'User found successfully',
                    user: foundUser,
                })
            }

            const newUser = await user.create(parsed.data)

            return res.status(201).send({
                message: 'User created successfully',
                user: newUser,
            })
        } catch (error) {
            return res.status(500).send({
                error: 'Failed to create user',
                details:
                    error && typeof error === 'object' && 'message' in error
                        ? (error as { message: string }).message
                        : String(error),
            })
        }
    }
}
