import { withIronSession } from 'next-iron-session'
import { NextApiRequest, NextApiResponse } from 'next'

// Tạo middleware để API route có thể sử dụng session.
export default function withSession(
    handler: (req: NextApiRequest, res: NextApiResponse) => void | Promise<void>,
) {
    // withIronSession: Một HOC (Higher Order Function) giúp thêm session vào handler API.
    return withIronSession(handler, {
        cookieName: 'multi-session',
        password: process.env.SESSION_SECRET!,
        ttl: 60 * 60 * 24,
        cookieOptions: {
            secure: process.env.NODE_ENV === 'production',
        },
    })
}
