import {
	getAuth,
	signOut as signOutFn,
	type User as FirebaseUser,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword
} from 'firebase/auth';
import { firebaseapp } from './init';

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
