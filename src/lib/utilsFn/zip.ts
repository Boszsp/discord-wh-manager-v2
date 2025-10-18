import { consola } from 'consola';
import { zip, unzip } from 'fflate/browser';
import { getMimeTypeFromFilename } from './file';
import { z } from 'zod';

interface optionType {
	level?: 0 | 2 | 1 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | undefined;
	filename?: string;
}

export const zipMimeTypeList = ["application/zip", "application/x-zip", "application/x-zip-compressed", "application/octet-stream", "application/zip"]
export const filesSchema = z.file().array().nonempty();
export const zipSchema = z.file().refine((f) => zipMimeTypeList.includes(f.type));

export const createZipFromUint8Array = (
	files: Record<string, Uint8Array>,
	level?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
): Promise<Uint8Array> => {
	return new Promise((resolve, reject) => {
		zip(files, { level }, (err, data) => {
			if (err) {
				consola.error(err);
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
};

export const createZip = async (files: File[], option?: optionType): Promise<File> => {
	files = filesSchema.parse(files);
	const fileData: Record<string, Uint8Array> = {};
	const fallbackFileName =
		files?.[0].name?.replaceAll('/', '-').replaceAll('.', '-') + '.zip';
	for (const file of files) {
		const buffer = await file.arrayBuffer();
		fileData[file.name] = new Uint8Array(buffer);
	}
	const data = await createZipFromUint8Array(fileData, option?.level);
	const blob = new Blob([data], { type: 'application/zip' });
	const zipFile = new File(
		[blob],
		option?.filename && option?.filename.length > 0
			? option?.filename + '.zip'
			: fallbackFileName,
		{ type: 'application/zip' }
	);
	return zipFile;
};

export const unzipFiles = async (zippedFile: File): Promise<File[]> => {
	zippedFile = zipSchema.parse(zippedFile)
	const zippedData = new Uint8Array(await zippedFile.arrayBuffer());
	return await new Promise((resolve, reject) => {
		unzip(zippedData, (err, unzipped) => {
			if (err) {
				consola.error(err);
				reject(err);
			} else {
				const files: File[] = [];
				for (const fileName in unzipped) {
					const fileData = unzipped[fileName];
					const blob = new Blob([fileData]);
					const file = new File([blob], fileName, { type: blob?.type && blob?.type.length> 0 ? blob?.type : getMimeTypeFromFilename(fileName)});
					files.push(file);
				}
				resolve(files);
			}
		});
	});
};
