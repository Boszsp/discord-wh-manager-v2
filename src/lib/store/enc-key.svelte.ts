import { DEFAULT_LOCAL_ENC_KEY } from '$lib/default';
import { loadFromLocalStorage } from './local-storage-cache.svelte';
import { writable } from 'svelte/store';

const initialEncKey = loadFromLocalStorage(DEFAULT_LOCAL_ENC_KEY);

export const encKeyStore = writable<string>(initialEncKey);

if (typeof window !== 'undefined') {
	encKeyStore.subscribe((value) => {
		// console.log('encKeyStore updated', value);
	});
}
