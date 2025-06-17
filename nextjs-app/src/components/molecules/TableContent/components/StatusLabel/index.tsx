import React from 'react'
import { Chip, Typography } from '@mui/material'

export enum Status {
    Draft = 'draft',
    Analyzed = 'analyzed',
    Confirmed = 'confirmed',
    Approved = 'approved',
    // Add more statuses as needed
}

const statusConfig: Record<
    Status,
    {
        label: string
        color: 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
    }
> = {
    [Status.Draft]: { label: 'Draft', color: 'default' },
    [Status.Analyzed]: { label: 'Analyzed', color: 'info' },
    [Status.Confirmed]: { label: 'Confirmed', color: 'warning' },
    [Status.Approved]: { label: 'Approved', color: 'success' },
}

interface StatusLabelProps {
    status: Status | string
}

const StatusLabel: React.FC<StatusLabelProps> = ({ status }) => {
    const config = statusConfig[status] || { label: status, color: 'default' }
    return (
        <Chip
            clickable={false}
            color={config.color}
            size="medium"
            onClick={() => {}}
            sx={{
                fontSize: '1rem',
                display: 'block',
                height: 'auto',
                py: 0.75,
                fontWeight: 600,
                width: '110px',
                mx: 'auto',
            }}
            label={
                <Typography
                    fontSize={'1rem'}
                    component="span"
                    color={config.label === Status.Analyzed ? 'wthite' : 'interit'}
                >
                    {config.label}
                </Typography>
            }
        />
    )
}

export default StatusLabel
