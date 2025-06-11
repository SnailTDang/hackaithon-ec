import mongoose from 'mongoose'
import fp from 'fastify-plugin'
import { FastifyInstance } from 'fastify'

const MONGODB_URI = 'mongodb://localhost:27017/intelligen-contract-data-extraction-review-database'

if (!MONGODB_URI) {
    throw new Error('⚠️ Please define the MONGODB_URI environment variable inside .env.local')
}

// Fastify plugin for MongoDB connection
async function dbConnector(fastify: FastifyInstance) {
    if (mongoose.connection.readyState === 1) {
        // Already connected
        fastify.log.info('MongoDB already connected')
        return
    }
    await mongoose.connect(MONGODB_URI, { bufferCommands: false })
    fastify.log.info('MongoDB connected')
}

export default fp(dbConnector)
