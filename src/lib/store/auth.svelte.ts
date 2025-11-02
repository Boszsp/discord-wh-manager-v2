import type { FirebaseUser } from '$lib/db/auth';
import { writable } from 'svelte/store';

export const userStore = writable<FirebaseUser|null>(null);
