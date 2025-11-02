import { writable } from 'svelte/store';
export const selectedFileStore = writable<string[]>([]);
