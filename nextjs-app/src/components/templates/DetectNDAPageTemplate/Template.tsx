import React from 'react'
import { Container, Tabs, Tab, Box } from '@mui/material'
import { useState } from 'react'
import DetectContract from '@/components/templates/DetectNDAPageTemplate/components/DetectContract'

const Template = () => {
    return (
        <Container maxWidth="xl" sx={{ mt: 2, mb: 2 }}>
            <DetectContract />
        </Container>
    )
}

export default Template
