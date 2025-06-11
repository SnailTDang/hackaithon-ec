import * as React from 'react'
import { GetServerSideProps } from 'next'
import axios from 'axios'
import NDAManagementTemplate from '@/components/templates/NDAManagementTemplate'

const NDAManagerPage = (props) => {
    return <NDAManagementTemplate {...props} />
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const baseUrl =
        process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'
    const query = context.query
    const params = new URLSearchParams(query as Record<string, string>).toString()
    const url = `${baseUrl}/api/contracts${params ? `?${params}` : ''}`

    try {
        const res = await axios.get(url)
        const data = res.data

        return {
            props: {
                contracts: data.contracts || [],
                pagination: data.pagination || {},
                filters: data.filters || {},
            },
        }
    } catch (error) {
        return {
            props: {
                contracts: [],
                pagination: {},
                filters: {},
            },
        }
    }
}

export default NDAManagerPage
