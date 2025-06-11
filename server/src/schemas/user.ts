import { z } from 'zod'

export const userSchema = z.object({
  username: z.string().min(1, 'username is required'),
})

export type TUser = z.infer<typeof userSchema>
