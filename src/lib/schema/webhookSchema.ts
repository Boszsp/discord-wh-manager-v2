import { z } from 'zod';

export const webhookSchema = z.object({
    name: z.string().min(6),
    url: z.url(),
});
export type webhookSchemaType = z.infer<typeof webhookSchema>;