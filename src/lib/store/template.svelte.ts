import { writable } from 'svelte/store';
import type { templateShemaType } from '$lib/schema/templateShema';

const isBrowser = typeof window !== 'undefined';

const initialValue: templateShemaType[] = isBrowser ? JSON.parse(window.localStorage.getItem('templates') || '[]') : [];

const templateStore = writable<templateShemaType[]>(initialValue);

templateStore.subscribe(value => {
    if (isBrowser) {
        window.localStorage.setItem('templates', JSON.stringify(value));
    }
});

export default templateStore;
