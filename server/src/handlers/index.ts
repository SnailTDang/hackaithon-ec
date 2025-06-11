import type { RouteHandler, HTTPMethods } from 'fastify'
import { deepseekChatHandler } from '../handlers/deepseekChatHandler'
import uploadContractHandler from './uploadContractHandler'
import getAllContractsHandler from './getAllContractsHandler'
import getContractHandler from './getContractHandler'
import downloadContractFileHandler from './downloadContractFileHandler'

// Store handler as a tuple: [method, path, handler]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RouteTuple = [HTTPMethods, string, RouteHandler<any>]

export const handlers: RouteTuple[] = [
    ['POST', '/api/analyze-contract', deepseekChatHandler],
    ['POST', '/api/contract/upload', uploadContractHandler],
    ['GET', '/api/contracts', getAllContractsHandler],
    ['GET', '/api/contract/:id', getContractHandler],
    ['GET', '/api/contract/download/:filename', downloadContractFileHandler],
]
