import * as React from 'react'
import { GetServerSideProps } from 'next'
import axios from 'axios'
import DetectNDAPageTemplate from '@/components/templates/DetectNDAPageTemplate'

const AnalystDetailPage = (props) => {
    return <DetectNDAPageTemplate {...props} />
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const baseUrl =
        process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'
    const { _id } = context.query
    console.log(context.query)
    // const params = new URLSearchParams(query as Record<string, string>).toString()
    const url = `${baseUrl}/api/contract/${_id}`

    try {
        const res = await axios.get(url)
        const data = res.data.contract
        console.log(data)
        return {
            props: {
                isDetailPage: true,
                contract: data || {},
                // pagination: data.pagination || {},
                // filters: data.filters || {},
            },
        }
    } catch (error) {
        console.log(error)

        return {
            props: {
                contracts: {},
            },
        }
    }
}

export default AnalystDetailPage
