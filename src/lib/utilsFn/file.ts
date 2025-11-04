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

export function getMimeTypeFromFilename(fname: string): string {
	const extension = fname.split('.').pop()?.toLowerCase();
	switch (extension) {
		case 'png':
			return 'image/png';
		case 'jpg':
		case 'jpeg':
			return 'image/jpeg';
		case 'gif':
			return 'image/gif';
		case 'web':
			return 'image/web';
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
			return 'text/plantext'; // Default to generic binary type
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