import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

/**
 * A list of common MIME types used for PDF files.
 * Includes the standard type, a common legacy type, and a generic binary type for fallback.
 */
export const pdfMimeTypeList = [
  "application/pdf",       // The official and most common MIME type for PDFs
  "application/x-pdf",     // An older, but still sometimes used, unofficial type
  "application/octet-stream" // A generic binary type, sometimes used as a fallback
];

// Set the worker source for pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export const createPdf = async (): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  page.drawText('You can create PDFs!');
  return pdfDoc.save();
};

export const splitPdf = async (pdfData: Uint8Array): Promise<Uint8Array[]> => {
  const pdfDoc = await PDFDocument.load(pdfData);
  const pageCount = pdfDoc.getPageCount();
  const pdfs: Uint8Array[] = [];

  for (let i = 0; i < pageCount; i++) {
    const newDoc = await PDFDocument.create();
    const [copiedPage] = await newDoc.copyPages(pdfDoc, [i]);
    newDoc.addPage(copiedPage);
    pdfs.push(await newDoc.save());
  }

  return pdfs;
};

export const extractPdfText = async (pdfData: Uint8Array): Promise<string> => {
  const loadingTask = pdfjsLib.getDocument({ data: pdfData });
  const pdf = await loadingTask.promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => (item as any).str).join(' ');
    fullText += pageText + '\n';
  }

  return fullText;
};

/**
 * Creates a PDF from an array of image files.
 *
 * @param images An array of image File objects (e.g., from an <input type="file">).
 * @param name Optional. The desired name for the output PDF file. Defaults to 'document.pdf'.
 * @param fixedSize Optional. If true, all pages will have the dimensions of the first image.
 *                  If false, each page will be sized to its corresponding image. Defaults to false.
 * @returns A Promise that resolves with the generated PDF as a File object.
 * @throws {Error} If the images array is empty or if an image format is unsupported.
 */
export async function createPdfFromImages(
  images: File[],
  name?: string,
  fixedSize: boolean = false
): Promise<File> {
  // --- 1. Input Validation ---
  if (!images || images.length === 0) {
    throw new Error('The images array cannot be empty.');
  }

  // --- 2. Initialize PDF Document ---
  const pdfDoc = await PDFDocument.create();

  let referenceDims: { width: number; height: number } | undefined;

  // --- 3. Process Each Image ---
  for (let i = 0; i < images.length; i++) {
    const imageFile = images[i];
    const imageBytes = await imageFile.arrayBuffer();

    // Embed the image. pdf-lib can infer the format (JPEG, PNG) for embed.
    let pdfImage;
    try {
      // Try to embed as a JPEG first as it's common for photos
      pdfImage = await pdfDoc.embedJpg(imageBytes);
    } catch (e) {
      try {
        // Fallback to PNG if JPEG fails
        pdfImage = await pdfDoc.embedPng(imageBytes);
      } catch (e) {
        // If both fail, the format is likely unsupported
        console.error(`Could not embed image: ${imageFile.name}. It might be an unsupported format.`, e);
        throw new Error(`Unsupported image format for file: ${imageFile.name}`);
      }
    }

    // --- 4. Determine Page Dimensions ---
    let pageWidth = pdfImage.width;
    let pageHeight = pdfImage.height;

    // If fixedSize is true, use the dimensions of the first image for all subsequent pages
    if (fixedSize) {
      if (i === 0) {
        // On the first run, store the dimensions as the reference
        referenceDims = { width: pdfImage.width, height: pdfImage.height };
      } else if (referenceDims) {
        // For all other pages, use the stored reference dimensions
        pageWidth = referenceDims.width;
        pageHeight = referenceDims.height;
      }
    }

    // --- 5. Add Page and Draw Image ---
    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    // Draw the image to fit the page.
    // Note: If fixedSize is true and an image has a different aspect ratio,
    // it will be stretched or cropped to fit the fixed page dimensions.
    page.drawImage(pdfImage, {
      x: 0,
      y: 0,
      width: pageWidth,
      height: pageHeight,
    });
  }

  // --- 6. Serialize and Return the PDF File ---
  const pdfBytes = await pdfDoc.save();
  const fileName = name && name?.length > 1 ? name + ".pdf" : images?.[0].name?.replaceAll("/", "-").replaceAll(".", "-") + ".pdf";

  return new File([pdfBytes], fileName, { type: 'application/pdf' });
}



/**
 * A factory function that creates a canvas setup for capturing images.
 * It uses a closure to maintain the list of captured images.
 */
function createImageCapture() {
  const capturedImagePromises: Promise<ImageBitmap>[] = [];

  const create = (width: number, height: number) => {
    if (typeof document === 'undefined') {
      throw new Error('This function requires a DOM environment (document).');
    }
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get 2D context from canvas.');
    }

    const originalDrawImage = context.drawImage.bind(context);

    // Override drawImage to intercept ImageBitmaps
    context.drawImage = (image: ImageBitmap, ...args: number[]) => {
      if (image && image.width > 0 && image.height > 0 && image instanceof ImageBitmap) {
        // Create a copy of the bitmap to prevent it from being recycled by the browser
        const canvasForCopy = document.createElement('canvas');
        canvasForCopy.width = image.width;
        canvasForCopy.height = image.height;
        const ctx = canvasForCopy.getContext('2d');
        if (ctx) {
          ctx.drawImage(image, 0, 0);
          // createImageBitmap is async, so we store the promise
          const bitmapPromise = createImageBitmap(canvasForCopy);
          capturedImagePromises.push(bitmapPromise);
        }
      }
      // Execute the original drawing operation
      return originalDrawImage(image, args[0], args[1], args[2], args[3]);
    };

    return { canvas, context };
  };

  const getCaptured = (): Promise<ImageBitmap[]> => {
    // Return a single promise that resolves when all individual image promises are resolved
    return Promise.all(capturedImagePromises);
  };

  return { create, getCaptured };
}


/**
 * Extracts all images from a PDF file by intercepting them during the render process.
 * This is the most robust method that avoids internal cache race conditions.
 *
 * @param pdf The PDF file to extract images from.
 * @param fileName Optional. A base name for the extracted image files.
 * @returns A Promise that resolves to an array of File objects.
 */
export async function extractPdfImages(pdf: File, fileName?: string): Promise<File[]> {
  if (!pdfjsLib) {
    throw new Error("pdfjs-dist library was not loaded correctly.");
  }

  const pdfData = await pdf.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: pdfData });
  const pdfDocument = await loadingTask.promise;

  const extractedFiles: File[] = [];
  let globalImageIndex = 1;

  for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
    const page = await pdfDocument.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2.0 });

    // 1. Get the list of image IDs (names) from the operator list
    const operatorList = await page.getOperatorList();
    const imageObjectIds: string[] = [];
    for (let i = 0; i < operatorList.fnArray.length; i++) {
      if (operatorList.fnArray[i] === pdfjsLib.OPS.paintImageXObject) {
        const imageId = operatorList.argsArray[i][0];
        imageObjectIds.push(imageId);
      }
    }

    if (imageObjectIds.length === 0) {
      continue; // No images on this page
    }

    // 2. Set up our functional canvas factory to capture the images
    const { create, getCaptured } = createImageCapture();
    const renderContext = {
      canvasContext: create(viewport.width, viewport.height).context,
      viewport: viewport,
    };

    // 3. Render the page. During this render, our factory will capture all the images.
    await page.render(renderContext as any).promise;

    // 4. Get the captured bitmaps. This will wait for all async image copies to complete.
    const capturedBitmaps = await getCaptured();

    if (capturedBitmaps.length !== imageObjectIds.length) {
      console.warn(`Page ${pageNum}: Mismatch between captured images (${capturedBitmaps.length}) and found IDs (${imageObjectIds.length}).`);
    }

    // 5. Create files from the captured bitmaps
    for (let i = 0; i < capturedBitmaps.length; i++) {
      const bitmap = capturedBitmaps[i];
      const objId = imageObjectIds[i];

      try {
        const imageCanvas = document.createElement('canvas');
        imageCanvas.width = bitmap.width;
        imageCanvas.height = bitmap.height;
        const ctx = imageCanvas.getContext('2d');
        if (!ctx) continue;

        ctx.drawImage(bitmap, 0, 0);
        bitmap.close(); // Release the bitmap memory

        const blob = await new Promise<Blob | null>((resolve) => {
          imageCanvas.toBlob(resolve, 'image/png');
        });

        if (!blob) continue;

        let finalFileName: string;
        if (fileName) {
          finalFileName = `${fileName}_p${pageNum}_${i + 1}.png`;
        } else {
          const isObjIdValid = /^[a-zA-Z0-9_-]+$/.test(objId);
          finalFileName = isObjIdValid ? `${objId}.png` : `${globalImageIndex++}.png`;
        }

        const file = new File([blob], finalFileName, { type: 'image/png' });
        extractedFiles.push(file);
      } catch (e) {
        console.error(`Failed to create file for captured image on page ${pageNum}:`, e);
      }
    }
  }

  return extractedFiles;
}