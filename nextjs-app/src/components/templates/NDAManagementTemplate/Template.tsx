import React from 'react'
import DetectContract from '@/components/templates/DetectNDAPageTemplate/components/DetectContract'
import CommonDialog from '@/components/molecules/Dialog'
import TableContent from '@/components/molecules/TableContent'
import { Button, colors, Container } from '@mui/material'
import { useState } from 'react'
import Link from 'next/link'

const Template = ({ contracts, pagination, filters }) => {
    const [openDetect, setOpenDetect] = useState(false)

    return (
        <>
            <Container maxWidth="xl" sx={{ mt: 2, mb: 2 }}>
                <Link href="/analyst" prefetch={false} passHref>
                    <Button variant="contained" sx={{ mb: 4 }}>
                        Detect Contract
                    </Button>
                </Link>
                <TableContent contracts={contracts} pagination={pagination} filters={filters} />

                <CommonDialog
                    isFullScreen={false}
                    size="xl"
                    headerSx={{ backgroundColor: 'primary' }}
                    open={openDetect}
                    onClose={() => setOpenDetect(false)}
                    dialogTitle="Detect Contract"
                >
                    <DetectContract />
                </CommonDialog>
            </Container>
        </>
    )
}

export default Template
