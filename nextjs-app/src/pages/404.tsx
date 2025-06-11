import { useRouter } from 'next/router'
import { useEffect } from 'react'

const NotFoundPage = () => {
    const router = useRouter()

    useEffect(() => {
        router.replace('/not-found')
    }, [router])

    return null
}
export default NotFoundPage
