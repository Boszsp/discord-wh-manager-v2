import {
	getAuth,
	signOut as signOutFn,
	type User as FirebaseUser,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	type User
} from 'firebase/auth';
import { firebaseapp } from './init';
import { browser } from '$app/environment';
import { userStore } from '$lib/store/auth.svelte';
import consola from 'consola';
import { get } from 'svelte/store';
import { clearFromLocalStorage } from '$lib/store/local-storage-cache.svelte';
import { DEFAULT_LOCAL_ENC_KEY } from '$lib/default';
import { refreshAll } from '$app/navigation';

export const auth = getAuth(firebaseapp);

export async function login(email: string, password: string) {
	return await signInWithEmailAndPassword(auth, email, password);
}

export async function signup(email: string, password: string) {
	return await createUserWithEmailAndPassword(auth, email, password);
}

export async function logout() {
	clearFromLocalStorage(DEFAULT_LOCAL_ENC_KEY)
	await signOutFn(auth);
	userStore.set(null)
	await refreshAll()
}

export async function getCurUserPromise(): Promise<FirebaseUser | null> {
	let count = 0
	let limit = 10
	let chache = get(userStore)
	if (chache!==null) {
		consola.info("Chched")
		return chache
	}
	if (browser) {
		while (auth.currentUser === null) {
			if (count >= limit) break
			await new Promise((resolve) => setTimeout(resolve, 400));
			count++;
		}
		userStore.set(auth.currentUser)
		
		return auth.currentUser;
	}
	return null
}

export { onAuthStateChanged, type User, type FirebaseUser }