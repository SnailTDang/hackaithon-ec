import React from 'react'
import TableContent from '@/components/molecules/TableContent'
import { Button, Container } from '@mui/material'
import Link from 'next/link'

const Template = ({ contracts, pagination, filters }) => {
    return (
        <>
            <Container maxWidth="xl" sx={{ mt: 2, mb: 2 }}>
                <Link href="/analyst" prefetch={false} passHref>
                    <Button variant="contained" sx={{ mb: 4 }}>
                        Detect Contract
                    </Button>
                </Link>
                <TableContent contracts={contracts} pagination={pagination} filters={filters} />
            </Container>
        </>
    )
}

export default Template
