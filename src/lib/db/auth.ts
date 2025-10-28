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

export const auth = getAuth(firebaseapp);

export async function login(email: string, password: string) {
	return await signInWithEmailAndPassword(auth, email, password);
}

export async function signup(email: string, password: string) {
	return await createUserWithEmailAndPassword(auth, email, password);
}

export async function logout() {
	await signOutFn(auth);
}

export async function getCurUserPromise(): Promise<FirebaseUser | null> {
	let count = 0
	let limit = 10
	let chache = null
	userStore.subscribe((u)=>chache = u)
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