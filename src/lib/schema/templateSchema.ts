import { z } from 'zod';
//import { hookJsonPartial } from './webhookContentSchema';
import { jsonRegexSchema } from './jsonSchema';
import { DEFAULT_ID_LENGTH } from '$lib/default';

export const templateSchema = z.object({
	id: z.string().length(DEFAULT_ID_LENGTH).optional(),
	name: z.string().min(1, 'Name is required'),
	content: jsonRegexSchema
});

export type TemplateSchemaType = z.infer<typeof templateSchema>;
