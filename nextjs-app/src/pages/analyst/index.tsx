import * as React from 'react'
import Button from '@mui/material/Button'
import FullScreenDialog from '@/components/molecules/Dialog'
import TableContent from '../../components/molecules/TableContent'
import { useState } from 'react'
import DetectContract from '@/components/molecules/DetectContract'
import { GetServerSideProps } from 'next'
import axios from 'axios'
import { Container } from '@mui/material'

const AnalystPage = ({ contracts, pagination, filters, children }) => {
    const [openDetect, setOpenDetect] = useState(false)

    return (
        <>
            <Container maxWidth="xl" sx={{ mt: 2, mb: 2 }}>
                <Button variant="contained" sx={{ m: 1 }} onClick={() => setOpenDetect(true)}>
                    Detect Contract
                </Button>
                <TableContent contracts={contracts} pagination={pagination} filters={filters} />

                <FullScreenDialog
                    open={openDetect}
                    onClose={() => setOpenDetect(false)}
                    dialogTitle="Detect Contract"
                >
                    <DetectContract />
                </FullScreenDialog>
                {children}
            </Container>
        </>
    )
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
                error: 'Không kết nối được tới API backend. Vui lòng kiểm tra server backend!',
            },
        }
    }
}

export default AnalystPage
