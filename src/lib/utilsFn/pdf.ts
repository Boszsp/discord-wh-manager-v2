import { PDFDocument } from 'pdf-lib';
import * as pdfjs from 'pdfjs-dist';

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
// This is a bit of a hack, but it works for now.
// In a real app, you'd want to host this worker file yourself.
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

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
  const loadingTask = pdfjs.getDocument({ data: pdfData });
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
 * Extracts all images from a PDF file (ROBUST VERSION).
 *
 * @param pdf The PDF file to extract images from.
 * @returns A Promise that resolves to an array of File objects, where each File is an extracted image in PNG format.
 *          Image names are derived from the PDF if available, otherwise they are named sequentially (e.g., 1.png, 2.png).
 * @throws {Error} If the PDF cannot be loaded or parsed.
 */
export async function extractPdfImages(pdf: File, fileName: string): Promise<File[]> {
  const pdfData = await pdf.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: pdfData });
  const pdfDocument = await loadingTask.promise;

  const extractedFiles: File[] = [];
  let imageIndex = 1;

  for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
    const page = await pdfDocument.getPage(pageNum);
    const operatorList = await page.getOperatorList();

    const imageObjectIds = new Set<string>();
    for (let i = 0; i < operatorList.fnArray.length; i++) {
      if (operatorList.fnArray[i] === pdfjs.OPS.paintImageXObject) {
        const imageId = operatorList.argsArray[i][0];
        imageObjectIds.add(imageId);
      }
    }

    for (const objId of imageObjectIds) {
      try {
        const pdfImageProxy = await page.objs.get(objId) as any;

        if (!pdfImageProxy || !pdfImageProxy.width || !pdfImageProxy.height) {
          continue;
        }

        // --- KEY FIX IS HERE ---
        // Instead of accessing 'rgbData' directly, we use the 'bitmap' property.
        // This is a promise that resolves to an ImageBitmap, which is a
        // fully decoded and ready-to-draw image object, handling all formats (JPEG, PNG, etc.)
        // and color spaces (CMYK, Grayscale, etc.) for us.
        if (!pdfImageProxy.bitmap) {
          console.warn(`Image object with ID ${objId} does not have a bitmap property. Skipping.`);
          continue;
        }
        const bitmap = await pdfImageProxy.bitmap;
        // --- END OF KEY FIX ---

        const canvas = document.createElement('canvas');
        canvas.width = pdfImageProxy.width;
        canvas.height = pdfImageProxy.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error('Could not get 2D context from canvas.');
        }

        // Draw the fully decoded bitmap onto the canvas
        ctx.drawImage(bitmap, 0, 0);

        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, 'image/png');
        });

        if (!blob) {
          continue;
        }

        fileName = /^[a-zA-Z0-9_-]+$/.test(objId) ? `${objId}.png` : `${imageIndex++}.png`.replaceAll("img", fileName && fileName.length < 1 ? fileName : 'img');
        const file = new File([blob], fileName, { type: 'image/png' });
        extractedFiles.push(file);

      } catch (e) {
        console.error(`Failed to extract image with ID ${objId}:`, e);
      }
    }
  }

  return extractedFiles;
}