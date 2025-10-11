import { DEFAULT_ID_LENGTH } from '$lib/default';
import { z } from 'zod';

export const webhookSchema = z.object({
    id:z.string().length(DEFAULT_ID_LENGTH).optional(),
    name: z.string().min(3),
    url: z.url(),
});
export type webhookSchemaType = z.infer<typeof webhookSchema>;