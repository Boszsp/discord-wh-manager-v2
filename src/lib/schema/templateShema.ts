import { z } from 'zod';

export const templateShema = z.object({
    name: z.string().min(1, 'Name is required'),
    content: z.string().min(1, 'Content is required')
});

export type templateShemaType = z.infer<typeof templateShema>;