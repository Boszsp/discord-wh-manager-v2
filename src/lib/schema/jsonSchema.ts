import { z } from 'zod';

export const jsonSchema = z.json();
export type jsonSchemaType = z.infer<typeof jsonSchema>;

export const jsonRegexSchema = z.string().refine(
  (val) => {
    try {
     JSON.parse(val);
      return true
    } catch (e) {
      return false;
    }
  },
  {
    message: "Input must be a valid JSON string with no newline characters in any string value.",
  }
).min(5)