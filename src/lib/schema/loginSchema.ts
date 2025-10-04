import { z } from 'zod';

export const loginSchema = z.object({
	username: z.string().email({ message: 'Invalid email address' }),
	password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
	passkey: z.string().length(16, { message: 'Passkey must be exactly 16 characters long' })
});
export type loginSchemaType = z.infer<typeof loginSchema>;