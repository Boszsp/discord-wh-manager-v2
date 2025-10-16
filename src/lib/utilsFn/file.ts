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