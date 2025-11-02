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
				files.push(new File([blob], 'clipboard-file', { type }));
			}
		}
	}
	return files;
}
