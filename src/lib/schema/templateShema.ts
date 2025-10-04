import { z } from 'zod';

export const templateShema = z.object({
    content: z.json()
    
});
export type templateShemaType = z.infer<typeof templateShema>;