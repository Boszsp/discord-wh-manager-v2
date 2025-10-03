import {z } from 'zod'

export const loginSchema = z.object(
    {
        username: z.email().min(5),
        password: z.string().min(6),
        passkey: z.string().length(16),
    }
)
export type loginSchemaType = z.infer<typeof loginSchema>