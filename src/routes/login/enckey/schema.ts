import { z } from 'zod';

export const schema = z.object(
    {
        enckey: z.string().length(16, { message: 'Enc key must be exactly 16 characters long' })
    }
)