import type { webhookSchemaType } from '$lib/schema/webhookSchema';
import { writable } from 'svelte/store';
export const channelStore = writable<Map<number,webhookSchemaType[]>|null>(null)
export const channelCurId = writable<{id:number|string,cid:number|string}|null>(null)
