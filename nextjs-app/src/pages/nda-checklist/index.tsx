/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import { GetServerSideProps } from 'next'
import { NDAChecklistTemplate } from '@/components/templates/NDAChecklistTemplate'

const NDAChecklistPage = (props) => {
    return <NDAChecklistTemplate {...props} />
}

export default NDAChecklistPage
export const getServerSideProps: GetServerSideProps = async (context) => {
    // You can fetch any data you need here
    // For example, fetching user data or NDA checklist items
    const { req } = context
    const user = (req as typeof req & { session?: { user?: any } })?.session?.user || null

    // Return the props to the page component
    return {
        props: {
            user,
            // Add any other props you want to pass to the template
        },
    }
}
