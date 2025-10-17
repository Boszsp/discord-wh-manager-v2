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
 * Extracts all images from a PDF file with maximum reliability.
 * This version pre-fetches all image objects to avoid race conditions.
 *
 * @param pdf The PDF file to extract images from.
 * @param fileName Optional. A base name for the extracted image files. If provided,
 *                 images will be named like `mydocument_p1_1.png`, `mydocument_p1_2.png`, etc.
 *                 If not provided, it falls back to using the PDF's internal object ID or a sequential index.
 * @returns A Promise that resolves to an array of File objects, where each File is an extracted image in PNG format.
 * @throws {Error} If the PDF cannot be loaded or parsed.
 */
export async function extractPdfImages(pdf: File, fileName?: string): Promise<File[]> {
  // Defensive check for bundler/HMR issues where the imported namespace might be undefined.
  if (!pdfjsLib) {
    throw new Error("pdfjs-dist library was not loaded correctly. Please check your import statement and bundler configuration.");
  }

  const pdfData = await pdf.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: pdfData });
  const pdfDocument = await loadingTask.promise;

  const extractedFiles: File[] = [];
  let globalImageIndex = 1; // Used for fallback naming

  for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
    const page = await pdfDocument.getPage(pageNum);

    // 1. Get the list of drawing operations
    const operatorList = await page.getOperatorList();
    const imageObjectIds = new Set<string>();

    for (let i = 0; i < operatorList.fnArray.length; i++) {
      if (operatorList.fnArray[i] === pdfjsLib.OPS.paintImageXObject) {
        const imageId = operatorList.argsArray[i][0];
        imageObjectIds.add(imageId);
      }
    }

    if (imageObjectIds.size === 0) {
      continue; // No images on this page, move to the next.
    }

    // 2. KEY FIX: Pre-fetch all image objects to ensure they are resolved.
    // This creates an array of promises, one for each image object.
    const imagePromises = Array.from(imageObjectIds).map(id => page.objs.get(id));
    // Await all of them simultaneously. This guarantees that after this line,
    // every object we're interested in is fully loaded in the page.objs cache.
    await Promise.all(imagePromises);

    // 3. Now that all objects are guaranteed to be available, process them.
    let imageIndexOnPage = 1; // Resets for each page

    for (const objId of imageObjectIds) {
      try {
        // This call will now succeed because the object has been explicitly fetched.
        const pdfImageProxy = await page.objs.get(objId) as any;

        if (!pdfImageProxy || !pdfImageProxy.width || !pdfImageProxy.height) {
          console.warn(`Object with ID ${objId} on page ${pageNum} is not a valid image. Skipping.`);
          continue;
        }

        // The 'bitmap' property is the most reliable way to get decoded image data.
        if (!pdfImageProxy.bitmap) {
          console.warn(`Image object with ID ${objId} on page ${pageNum} does not have a bitmap property. Skipping.`);
          continue;
        }
        const bitmap = await pdfImageProxy.bitmap;

        // Create a canvas to draw the bitmap and convert it to a PNG blob.
        const imageCanvas = document.createElement('canvas');
        imageCanvas.width = pdfImageProxy.width;
        imageCanvas.height = pdfImageProxy.height;
        const ctx = imageCanvas.getContext('2d');

        if (!ctx) {
          throw new Error('Could not get 2D context from canvas.');
        }

        ctx.drawImage(bitmap, 0, 0);

        const blob = await new Promise<Blob | null>((resolve) => {
          imageCanvas.toBlob(resolve, 'image/png');
        });

        if (!blob) {
          continue;
        }

        // --- Filename Generation Logic ---
        let finalFileName: string;
        if (fileName) {
          finalFileName = `${fileName}_p${pageNum}_${imageIndexOnPage++}.png`;
        } else {
          const isObjIdValid = /^[a-zA-Z0-9_-]+$/.test(objId);
          finalFileName = isObjIdValid ? `${objId}.png` : `${globalImageIndex++}.png`;
        }

        const file = new File([blob], finalFileName, { type: 'image/png' });
        extractedFiles.push(file);

      } catch (e) {
        console.error(`Failed to extract image with ID ${objId} on page ${pageNum}:`, e);
      }
    }
  }

  return extractedFiles;
}