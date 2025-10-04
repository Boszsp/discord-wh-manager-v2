import { z } from 'zod';

export const serverSchema = z.object({
	name: z.string().min(3, 'Server name must be at least 3 characters long'),
	color: z.string().min(4, 'Invalid hexadecimal color code. Must be #RGB or #RRGGBB.').regex(
		/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
		{ message: 'Invalid hexadecimal color code. Must be #RGB or #RRGGBB.' }
	).optional()
});

export type ServerSchema = typeof serverSchema;
