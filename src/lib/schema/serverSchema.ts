import { z } from 'zod';

export const serverSchema = z.object({
	name: z.string().min(3, 'Server name must be at least 3 characters long')
});

export type ServerSchema = typeof serverSchema;
