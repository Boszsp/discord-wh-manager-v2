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
