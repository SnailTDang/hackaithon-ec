import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { StatusCodes } from 'http-status-codes'

export const errorHandler = async (
    error: FastifyError,
    request: FastifyRequest,
    reply: FastifyReply,
) => {
    // Log error in structured format
    request.log.error({
        msg: error.message,
        stack: error.stack,
        code: error.code,
        url: request.url,
        method: request.method,
        params: request.params,
        body: request.body,
    })

    if (reply.sent) {
        return
    }
    await (
        error.statusCode
            ? reply.status(error.statusCode).send({ errorMessage: error.message })
            : reply.status(StatusCodes.INTERNAL_SERVER_ERROR)
    ).send({ errorMessage: error.message })
}
