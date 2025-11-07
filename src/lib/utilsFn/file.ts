export function convertFileSize(
	byte: number = 0,
	unit: 'B' | 'KB' | 'MB' | 'GB' | 'TB' = 'MB',
	floating_point: number = 2
): number {
	const units: { [key in 'B' | 'KB' | 'MB' | 'GB' | 'TB']: number } = {
		B: 1,
		KB: 1024,
		MB: 1024 * 1024,
		GB: 1024 * 1024 * 1024,
		TB: 1024 * 1024 * 1024 * 1024
	};

	const conversionFactor = units[unit];
	if (!conversionFactor) {
		throw new Error(`Invalid unit: ${unit}`);
	}

	return parseFloat((byte / conversionFactor).toFixed(floating_point));
}

/**
 * Formats a number of bytes into a human-readable string with units (KB, MB, GB, etc.).
 *
 * @param bytes The number of bytes to format.
 * @param decimals Optional. The number of decimal places to display. Defaults to 2.
 * @returns The formatted human-readable string (e.g., "1.43 MB", "500 KB", "1.2 GB").
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
	if (bytes === 0) return '0 Bytes';
	if (!isFinite(bytes)) return 'Invalid size';
	const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

	let unitIndex = 0;
	let size = bytes;

	while (size >= 1024 && unitIndex < units.length - 1) {
		size /= 1024;
		unitIndex++;
	}

	const formattedSize = size.toFixed(decimals);

	return `${formattedSize} ${units[unitIndex]}`;
}

export function getMimeTypeFromFilename(fname: string): string|null {
	const extension = fname.split('.').pop()?.toLowerCase();
	switch (extension) {
		case 'png':
			return 'image/png';
		case 'jpg':
		case 'jpeg':
			return 'image/jpeg';
		case 'gif':
			return 'image/gif';
		case 'webp':
			return 'image/webp';
		case 'bmp':
			return 'image/bmp';
		case 'svg':
			return 'image/svg+xml';
		case 'pdf':
			return 'application/pdf';
		case 'txt':
			return 'text/plain';
		case 'html':
			return 'text/html';
		case 'css':
			return 'text/css';
		case 'js':
			return 'application/javascript';
		case 'json':
			return 'application/json';
		case 'zip':
			return 'application/zip';
		case 'vue':
			return 'text/vue';
		case 'svelte':
			return 'text/svelte';
		case 'md':
			return 'text/markdown';
		case 'mp4':
			return 'video/mp4';
		case 'mp3':
			return 'audio/mpeg';
		case 'wav':
			return 'audio/wav';
		case 'webm':
			return 'video/webm';
		case 'mov':
			return 'video/quicktime';
		case 'avi':
			return 'video/x-msvideo';
		case 'php':
			return 'text/php';
		case 'py':
			return 'text/python';
		case 'gzip':
			return 'application/gzip';
		case 'tar':
			return 'application/x-tar';
		case '7z':
			return 'application/x-7z-compressed';
		case 'rar':
			return 'application/x-rar-compressed';
		default:
			return null;
	}
}

export async function getFilesFromClipboard(): Promise<File[]> {
	const clipboardItems = await navigator.clipboard.read();
	const files: File[] = [];
	for (const item of clipboardItems) {
		for (const type of item.types) {
			if (type.startsWith('image/') || type === 'application/pdf' || type === 'application/zip') {
				const blob = await item.getType(type);
				files.push(new File([blob], 'file-' + Date.now() + getExtensionFromMimeType(type), { type }));
			}
		}
	}
	return files;
}

/**
 * A map of common MIME types to their corresponding file extensions.
 * The extension includes the leading dot (e.g., '.jpg').
 */
const MIME_TYPE_MAP: { [key: string]: string } = {
	// Images
	'image/jpeg': '.jpg',
	'image/jpg': '.jpg',
	'image/png': '.png',
	'image/gif': '.gif',
	'image/webp': '.webp',
	'image/svg+xml': '.svg',
	'image/bmp': '.bmp',
	'image/tiff': '.tiff',
	'image/x-icon': '.ico',

	// Documents
	'application/pdf': '.pdf',
	'application/msword': '.doc',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
	'application/vnd.ms-excel': '.xls',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
	'application/vnd.ms-powerpoint': '.ppt',
	'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
	'text/plain': '.txt',
	'text/csv': '.csv',
	'text/rtf': '.rtf',

	// Web/Code
	'text/html': '.html',
	'text/css': '.css',
	'text/javascript': '.js',
	'application/json': '.json',
	'application/xml': '.xml',
	'application/ld+json': '.jsonld',

	// Archives
	'application/zip': '.zip',
	'application/x-rar-compressed': '.rar',
	'application/x-tar': '.tar',
	'application/gzip': '.gz',
	'application/x-7z-compressed': '.7z',

	// Audio
	'audio/mpeg': '.mp3',
	'audio/wav': '.wav',
	'audio/ogg': '.ogg',
	'audio/aac': '.aac',
	'audio/flac': '.flac',

	// Video
	'video/mp4': '.mp4',
	'video/mpeg': '.mpeg',
	'video/quicktime': '.mov',
	'video/x-msvideo': '.avi',
	'video/webm': '.webm',
};

/**
 * Retrieves the file extension for a given MIME type.
 *
 * This function is case-insensitive and ignores any parameters in the MIME type string
 * (e.g., it correctly processes 'text/html; charset=UTF-8').
 *
 * @param mimeType - The MIME type string (e.g., 'image/jpeg').
 * @returns The corresponding file extension (e.g., '.jpg') or null if the MIME type is not found.
 */
export function getExtensionFromMimeType(mimeType: string | null | undefined): string | null {
	// 1. Handle null, undefined, or empty input
	if (!mimeType) {
		return null;
	}

	// 2. Sanitize the input: convert to lowercase and remove any parameters (like '; charset=utf-8')
	const baseMimeType = mimeType.toLowerCase().split(';')[0].trim();

	// 3. Look up the MIME type in the map and return the extension, or null if not found.
	return MIME_TYPE_MAP[baseMimeType] || "";
}



/**
 * Represents a file signature used for MIME type detection.
 */
interface FileSignature {
	/** The MIME type string, e.g., 'image/png'. */
	mime: string;
	/** The byte sequence (magic numbers) that identifies the file type. */
	signature: number[];
	/** The offset in bytes where the signature starts. Defaults to 0. */
	offset?: number;
}

/**
 * A database of common file signatures.
 * This list can be expanded to support more file types.
 * Source: Wikipedia's "List of file signatures" and other references.
 */
const FILE_SIGNATURES: FileSignature[] = [
	// Images
	{ mime: 'image/png', signature: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A] },
	{ mime: 'image/jpeg', signature: [0xFF, 0xD8, 0xFF] },
	{ mime: 'image/gif', signature: [0x47, 0x49, 0x46, 0x38] }, // GIF87a or GIF89a
	{ mime: 'image/webp', signature: [0x52, 0x49, 0x46, 0x46], offset: 0 }, // RIFF
	{ mime: 'image/webp', signature: [0x57, 0x45, 0x42, 0x50], offset: 8 }, // WEBP

	// Documents
	{ mime: 'application/pdf', signature: [0x25, 0x50, 0x44, 0x46, 0x2D] }, // %PDF-
	{ mime: 'application/msword', signature: [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1] }, // DOC, XLS, PPT (OLE2)
	{ mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', signature: [0x50, 0x4B, 0x03, 0x04] }, // DOCX, XLSX, PPTX (ZIP-based)

	// Archives
	{ mime: 'application/zip', signature: [0x50, 0x4B, 0x03, 0x04] },
	{ mime: 'application/x-rar-compressed', signature: [0x52, 0x61, 0x72, 0x21, 0x1A, 0x07, 0x00] },
	{ mime: 'application/x-7z-compressed', signature: [0x37, 0x7A, 0xBC, 0xAF, 0x27, 0x1C] },

	// Video/Audio
	{ mime: 'video/mp4', signature: [0x66, 0x74, 0x79, 0x70], offset: 4 }, // 'ftyp' box
	{ mime: 'video/quicktime', signature: [0x6D, 0x6F, 0x6F, 0x76], offset: 4 }, // 'moov' box
	{ mime: 'audio/mpeg', signature: [0x49, 0x44, 0x33] }, // ID3 tag for MP3
	{ mime: 'audio/x-wav', signature: [0x52, 0x49, 0x46, 0x46], offset: 0 }, // RIFF
	{ mime: 'audio/x-wav', signature: [0x57, 0x41, 0x56, 0x45], offset: 8 }, // WAVE
];

/**
 * Determines the MIME type of a file by inspecting its binary signature.
 * This is more reliable than using the file name or extension.
 *
 * @param file The File or Blob object to inspect.
 * @returns A Promise that resolves to the detected MIME type string, or null if the type is unknown.
 */
export async function getMimeTypeFromBlob(file: File | Blob): Promise<string | null> {
	// We only need to read the first few bytes of the file.
	// Determine the maximum number of bytes we need to read for any signature.
	const maxBytesToRead = Math.max(
		...FILE_SIGNATURES.map(sig => (sig.offset || 0) + sig.signature.length)
	);

	// Ensure we don't try to read more bytes than the file contains.
	const bytesToSlice = Math.min(file.size, maxBytesToRead);
	if (bytesToSlice === 0) {
		return null; // Empty file
	}

	try {
		// Read the necessary part of the file as an ArrayBuffer.
		const buffer = await file.slice(0, bytesToSlice).arrayBuffer();
		const arr = new Uint8Array(buffer);

		// Check the file's bytes against each known signature.
		for (const signature of FILE_SIGNATURES) {
			const offset = signature.offset || 0;
			const fileSlice = arr.slice(offset, offset + signature.signature.length);

			if (fileSlice.length !== signature.signature.length) {
				continue; // Not enough bytes to match this signature.
			}

			// Check if every byte in the slice matches the signature.
			const isMatch = fileSlice.every((byte, index) => byte === signature.signature[index]);

			if (isMatch) {
				return signature.mime;
			}
		}
	} catch (error) {
		console.error("Error reading file for MIME type detection:", error);
		return null;
	}

	// If no signature matches, the MIME type is unknown.
	return file.type;
}