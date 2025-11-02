// It's better to use a password-based key derivation function (PBKDF2)
// to derive a key from a user's password. This adds a salt and iterations
// to make it harder to brute-force.

import { consola } from "consola";

const ENCRYPTION_ALGORITHM = 'AES-GCM';
const KEY_DERIVATION_ALGORITHM = 'PBKDF2';
const HASH_ALGORITHM = 'SHA-256';
const KEY_DERIVATION_ITERATIONS = 100000;

/**
 * Derives a key from a password and salt.
 * @param password The user's password.
 * @param salt A random salt.
 * @returns The derived CryptoKey.
 */
export async function deriveKey(password: string, salt: Uint8Array = generateSalt()): Promise<CryptoKey> {
	const keyMaterial = await window.crypto.subtle.importKey(
		'raw',
		new TextEncoder().encode(password),
		{ name: KEY_DERIVATION_ALGORITHM },
		false,
		['deriveKey']
	);
	return window.crypto.subtle.deriveKey(
		{
			name: KEY_DERIVATION_ALGORITHM,
			salt: salt,
			iterations: KEY_DERIVATION_ITERATIONS,
			hash: HASH_ALGORITHM
		},
		keyMaterial,
		{ name: ENCRYPTION_ALGORITHM, length: 256 },
		true,
		['encrypt', 'decrypt']
	);
}

/**
 * Generates a new random salt.
 * @returns A new Uint8Array salt.
 */
export function generateSalt(): Uint8Array {
	return window.crypto.getRandomValues(new Uint8Array(16));
}

/**
 * Encrypts data using AES-GCM.
 * @param key The encryption key.
 * @param data The string data to encrypt.
 * @returns A base64 encoded string containing the iv and the encrypted data.
 */
export async function encrypt(key: CryptoKey, data: string): Promise<string> {
	const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 12 bytes for AES-GCM is recommended
	const encodedData = new TextEncoder().encode(data);

	const encryptedContent = await window.crypto.subtle.encrypt(
		{
			name: ENCRYPTION_ALGORITHM,
			iv: iv
		},
		key,
		encodedData
	);

	const encryptedBytes = new Uint8Array(encryptedContent);
	const result = new Uint8Array(iv.length + encryptedBytes.length);
	result.set(iv);
	result.set(encryptedBytes, iv.length);

	return btoa(String.fromCharCode.apply(null, Array.from(result)));
}

/**
 * Decrypts data using AES-GCM.
 * @param key The decryption key.
 * @param encryptedData The base64 encoded encrypted string.
 * @returns The decrypted string.
 */
export async function decrypt(key: CryptoKey, encryptedData: string): Promise<string> {
	const encryptedBytes = new Uint8Array(
		atob(encryptedData)
			.split('')
			.map((char) => char.charCodeAt(0))
	);

	const iv = encryptedBytes.slice(0, 12);
	const data = encryptedBytes.slice(12);

	const decryptedContent = await window.crypto.subtle.decrypt(
		{
			name: ENCRYPTION_ALGORITHM,
			iv: iv
		},
		key,
		data
	);

	return new TextDecoder().decode(decryptedContent);
}

function uint8ArrayToBase64(array: Uint8Array): string {
	return btoa(String.fromCharCode.apply(null, Array.from(array)));
}

function base64ToUint8Array(base64: string): Uint8Array {
	return new Uint8Array(
		atob(base64)
			.split('')
			.map((c) => c.charCodeAt(0))
	);
}

export async function encStr(text: string, encKey: string): Promise<string> {
	if (!text) return text;
	try {
		const salt = generateSalt();
		const key = await deriveKey(encKey, salt);
		const encrypted = await encrypt(key, text);
		const saltB64 = uint8ArrayToBase64(salt);
		return `${saltB64}:${encrypted}`;
	} catch (e) {
		consola.warn('Encryption failed', e);
		return text;
	}
}

export async function decStr(encryptedText: string, encKey: string): Promise<string> {
	if (!encryptedText || !encryptedText.includes(':')) return encryptedText;
	try {
		const parts = encryptedText.split(':');
		if (parts.length !== 2) {
			return encryptedText;
		}
		const [saltB64, encrypted] = parts;
		const salt = base64ToUint8Array(saltB64);
		const key = await deriveKey(encKey, salt);
		const deccrypted=  await decrypt(key, encrypted);
		consola.success('Decryption successful with output', deccrypted);
		return deccrypted
	} catch (e) {
		consola.warn('Decryption failed', e);
		return encryptedText;
	}
}
