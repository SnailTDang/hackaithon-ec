/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig, Method } from 'axios'

export interface ApiHandlerOptions {
    method?: Method
    url: string
    data?: any
    params?: any
    headers?: Record<string, string>
    onSuccess?: (msg: string, data?: any) => void
    onError?: (msg: string) => void
    setLoading?: (v: boolean) => void
    successMessage?: string
    errorMessage?: string
}

const apiHandler = async (options: ApiHandlerOptions) => {
    const {
        method = 'GET',
        url,
        data,
        params,
        headers = {},
        onSuccess,
        onError,
        setLoading,
        successMessage = 'Success',
        errorMessage = 'Request failed',
    } = options
    if (setLoading) setLoading(true)
    if (onError) onError('')
    if (onSuccess) onSuccess('')
    try {
        const config: AxiosRequestConfig = {
            method,
            url,
            data,
            params,
            headers,
        }
        const response = await axios(config)
        if (onSuccess) onSuccess(successMessage, response.data)
        return response.data
    } catch (err: unknown) {
        const msg =
            err && typeof err === 'object' && 'message' in err
                ? (err as { message: string }).message
                : String(err)
        if (onError) onError(msg || errorMessage)
        throw err
    } finally {
        if (setLoading) setLoading(false)
    }
}

export default apiHandler
