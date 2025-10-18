/**
 * A list of common image MIME types that can be used for conversion.
 * Note: Browser support for 'image/webp' and 'image/avif' may vary.
 */
export const SUPPORTED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/bmp',
  'image/gif',
] as const;

export type SupportedImageMimeType = typeof SUPPORTED_IMAGE_MIME_TYPES[number];

/**
 * Options for image conversion.
 */
export interface ConversionOptions {
  /**
   * A number between 0 and 1 indicating the image quality.
   * Applicable for lossy formats like JPEG and WebP. Defaults to 0.92.
   */
  quality?: number;
  /**
   * A CSS color string to use as a background color.
   * This is useful when converting from a format with transparency (like PNG)
   * to one that does not support it (like JPEG). Defaults to '#FFFFFF' (white).
   */
  backgroundColor?: string;
}

/**
 * Converts an image File from one format to another using the browser's Canvas API.
 *
 * @param imageFile The source image File object (e.g., from an <input type="file">).
 * @param outputMimeType The desired output MIME type (e.g., 'image/jpeg', 'image/webp').
 * @param options Optional settings for quality and background color.
 * @returns A Promise that resolves with the converted image as a new File object.
 * @throws {Error} If the input file is not a valid image, the output type is unsupported, or conversion fails.
 */
export async function convertImageType(
  imageFile: File,
  outputMimeType: SupportedImageMimeType,
  options: ConversionOptions = {}
): Promise<File> {
  // --- 1. Input Validation ---
  if (!imageFile || !imageFile.type.startsWith('image/')) {
    throw new Error('Invalid input: The provided file is not a valid image.');
  }

  if (!SUPPORTED_IMAGE_MIME_TYPES.includes(outputMimeType)) {
    throw new Error(`Unsupported output MIME type: ${outputMimeType}. Supported types are: ${SUPPORTED_IMAGE_MIME_TYPES.join(', ')}`);
  }

  // Set default options
  const { quality = 0.92, backgroundColor = '#FFFFFF' } = options;

  // --- 2. Create an ImageBitmap from the file ---
  // createImageBitmap is a modern, efficient way to load image data asynchronously.
  let imageBitmap: ImageBitmap;
  try {
    imageBitmap = await createImageBitmap(imageFile);
  } catch (error) {
    throw new Error(`Failed to load image data. The file might be corrupted. Error: ${error}`);
  }

  // --- 3. Set up the Canvas ---
  const canvas = document.createElement('canvas');
  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get 2D rendering context from canvas.');
  }

  // --- 4. Handle Background Color for Non-Transparent Formats ---
  // JPEGs don't support transparency, so we fill the canvas with a background color first.
  if (outputMimeType === 'image/jpeg' && backgroundColor) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // --- 5. Draw the Image to the Canvas ---
  ctx.drawImage(imageBitmap, 0, 0);

  // --- 6. Convert Canvas to Blob and then to a File ---
  // We wrap toBlob in a Promise to make it easier to work with async/await.
  const blob = await new Promise<Blob | null>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error('Canvas toBlob conversion failed or returned null.'));
        }
      },
      outputMimeType,
      quality
    );
  });

  if (!blob) {
    // This case should be caught by the reject in the promise, but as a safeguard:
    throw new Error('Failed to generate image blob.');
  }

  // --- 7. Create the Final File Object ---
  // Determine the new file extension from the MIME type.
  const extension = outputMimeType.split('/')[1];
  const originalName = imageFile.name.split('.').slice(0, -1).join('.');
  const newFileName = `${originalName}.${extension}`;

  return new File([blob], newFileName, { type: outputMimeType });
}