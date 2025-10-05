import { z } from 'zod';

export const jsonSchema = z.json();
export type jsonSchemaType = z.infer<typeof jsonSchema>;

export const jsonRegexSchema = z.string().regex(/^\{.+\:.+\}$/).min(5)