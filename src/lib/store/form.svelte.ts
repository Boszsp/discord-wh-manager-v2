import type { hookJsonPartialSchemaType } from '$lib/schema/webhookContentSchema';
import { writable } from 'svelte/store';
export const fromStore = writable<hookJsonPartialSchemaType |null>(null)
