import { z } from 'zod';
import { hookJsonPartial } from './webhookContentSchema';
import { jsonRegexSchema } from './jsonSchema';

export const templateShema = z.object({
    name: z.string().min(1, 'Name is required'),
    content: jsonRegexSchema
});

export type templateShemaType = z.infer<typeof templateShema>;