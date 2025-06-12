import React from 'react'
import { Container } from '@mui/material'
import DetectContract from '@/components/templates/DetectNDAPageTemplate/components/DetectContract'

const Template = () => {
    return (
        <Container maxWidth="xl" sx={{ mt: 2, mb: 2 }}>
            <DetectContract />
        </Container>
    )
}

export default Template
