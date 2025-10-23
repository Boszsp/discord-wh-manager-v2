import { PDFDocument } from 'pdf-lib';
import { unzip } from 'fflate/browser';
import { getMimeTypeFromFilename } from './file';
import { createZipFromUint8Array } from './zip';

/**
 * Splits a file into smaller chunks if it exceeds a specified size limit.
 * This function currently supports splitting for PDF and ZIP files.
 *
 * @param file The file to be split.
 * @param maxSizeInMB The maximum size for each chunk in megabytes.
 * @returns A promise that resolves to an array of files. If the original file is smaller than the limit,
 *          it will be returned as a single-element array. If the file type is not supported for splitting
 *          and it exceeds the size limit, an error will be thrown.
 */
export async function splitFile(
	file: File,
	maxSizeInMB: number,
	compressLevel?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
): Promise<File[]> {
	const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

	if (file.size <= maxSizeInBytes) {
		return [file];
	}

	const mimeType = file.type || getMimeTypeFromFilename(file.name);

	if (mimeType === 'application/pdf') {
		return await splitPdf(file, maxSizeInBytes);
	} else if (mimeType === 'application/zip') {
		return await splitZip(file, maxSizeInBytes, compressLevel);
	} else {
		throw new Error(`File type ${mimeType} is not supported for splitting.`);
	}
}

async function splitPdf(file: File, maxSizeInBytes: number): Promise<File[]> {
	const pdfData = await file.arrayBuffer();
	const pdfDoc = await PDFDocument.load(pdfData);
	const pageCount = pdfDoc.getPageCount();
	const pdfs: File[] = [];
	let part = 1;

	let newDoc = await PDFDocument.create();
	let currentSize = 0;

	for (let i = 0; i < pageCount; i++) {
		const [copiedPage] = await newDoc.copyPages(pdfDoc, [i]);
		newDoc.addPage(copiedPage);

		// Estimate size. This is not perfect. A better way is to save and check size.
		// For simplicity, we'll assume each page adds a similar amount of size.
		// A more accurate method would be to save the doc, check the size, and if it's too big,
		// remove the last added page and start a new document.
		// This implementation splits page by page which is simpler and safer.
		const bytes = await newDoc.save();
		currentSize = bytes.length;

		if (currentSize > maxSizeInBytes) {
			// The current newDoc without the last page was under the limit.
			const docToSave = await PDFDocument.create();
			const pagesToCopy = newDoc.getPageIndices().slice(0, -1);
			if (pagesToCopy.length > 0) {
				const copiedPages = await docToSave.copyPages(newDoc, pagesToCopy);
				copiedPages.forEach((p) => docToSave.addPage(p));
				const savedBytes = await docToSave.save();
				pdfs.push(
					new File([savedBytes], `${file.name.replace('.pdf', '')}-part${part++}.pdf`, {
						type: 'application/pdf'
					})
				);
			}

			// Start a new document with the current page
			newDoc = await PDFDocument.create();
			const [reCopiedPage] = await newDoc.copyPages(pdfDoc, [i]);
			newDoc.addPage(reCopiedPage);
		}
	}

	// Save the last document
	if (newDoc.getPageCount() > 0) {
		const savedBytes = await newDoc.save();
		pdfs.push(
			new File([savedBytes], `${file.name.replace('.pdf', '')}-part${part++}.pdf`, {
				type: 'application/pdf'
			})
		);
	}

	return pdfs;
}

async function splitZip(
	file: File,
	maxSizeInBytes: number,
	compressLevel?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
): Promise<File[]> {
	const zippedData = new Uint8Array(await file.arrayBuffer());
	const unzipped = await new Promise<Record<string, Uint8Array>>((resolve, reject) => {
		unzip(zippedData, (err, data) => {
			if (err) reject(err);
			else resolve(data);
		});
	});

	const zips: File[] = [];
	let part = 1;
	let currentZipFiles: Record<string, Uint8Array> = {};
	let currentSize = 0;

	for (const fileName in unzipped) {
		const fileData = unzipped[fileName];

		if (currentSize + fileData.length > maxSizeInBytes && Object.keys(currentZipFiles).length > 0) {
			const zipData = await createZipFromUint8Array(currentZipFiles, compressLevel);
			const zipBlob = new Blob([zipData], { type: 'application/zip' });
			zips.push(
				new File([zipBlob], `${file.name.replace('.zip', '')}-part${part++}.zip`, {
					type: 'application/zip'
				})
			);
			currentZipFiles = {};
			currentSize = 0;
		}

		currentZipFiles[fileName] = fileData;
		currentSize += fileData.length;
	}

	if (Object.keys(currentZipFiles).length > 0) {
		const zipData = await createZipFromUint8Array(currentZipFiles, compressLevel);
		const zipBlob = new Blob([zipData], { type: 'application/zip' });
		zips.push(
			new File([zipBlob], `${file.name.replace('.zip', '')}-part${part++}.zip`, {
				type: 'application/zip'
			})
		);
	}

	return zips;
}
