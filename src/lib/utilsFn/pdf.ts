import { PDFDocument } from 'pdf-lib';
import * as pdfjs from 'pdfjs-dist';

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
  const fileName = name || 'document.pdf';

  return new File([pdfBytes], fileName, { type: 'application/pdf' });
}