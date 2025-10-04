import { z } from 'zod';

export const webhookSchema = z.object({
    name: z.string().min(6),
    url: z.url().length(16),
});
export type webhookSchemaType = z.infer<typeof webhookSchema>;