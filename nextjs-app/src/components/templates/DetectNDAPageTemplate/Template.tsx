import React from 'react'
import DetectContract from '@/components/molecules/DetectContract'
import FullScreenDialog from '@/components/molecules/Dialog'
import TableContent from '@/components/molecules/TableContent'
import { Button, Container } from '@mui/material'
import { useState } from 'react'

const Template = ({ contracts, pagination, filters, children }) => {
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

export default Template
