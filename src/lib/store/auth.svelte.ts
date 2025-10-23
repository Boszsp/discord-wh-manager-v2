import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { readable } from 'svelte/store';
import { firebaseapp } from '$lib/db/init';

export const auth = getAuth(firebaseapp);

function createUserStore() {
	const { subscribe } = readable<User | null | undefined>(undefined, (set) => {
		const unsubscribe = onAuthStateChanged(
			auth,
			(user) => {
				set(user);
			},
			(error) => {
				console.error('Error in auth state change:', error);
				set(null);
			}
		);

		return () => unsubscribe();
	});

	async function awaitUser() {
		return new Promise<User | null>((resolve) => {
			const unsub = subscribe((user) => {
				if (user !== undefined) {
					unsub();
					resolve(user);
				}
			});
		});
	}

	return {
		subscribe,
		awaitUser
	};
}

export const user = createUserStore();
