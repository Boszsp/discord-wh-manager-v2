import { zip, unzip } from 'fflate';

export const createZip = async (files: File[]): Promise<File> => {
	const fileData: Record<string, Uint8Array> = {};
	for (const file of files) {
		const buffer = await file.arrayBuffer();
		fileData[file.name] = new Uint8Array(buffer);
	}

	return new Promise((resolve, reject) => {
		zip(fileData, (err, data) => {
			if (err) {
				reject(err);
			} else {
				const blob = new Blob([data], { type: 'application/zip' });
				const zipFile = new File([blob], 'archive.zip', { type: 'application/zip' });
				resolve(zipFile);
			}
		});
	});
};

export const unzipFiles = (zippedFile: File): Promise<File[]> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const zippedData = new Uint8Array(reader.result as ArrayBuffer);
			unzip(zippedData, (err, unzipped) => {
				if (err) {
					reject(err);
				} else {
					const files: File[] = [];
					for (const fileName in unzipped) {
						const fileData = unzipped[fileName];
						const blob = new Blob([fileData]);
						const file = new File([blob], fileName);
						files.push(file);
					}
					resolve(files);
				}
			});
		};
		reader.onerror = reject;
		reader.readAsArrayBuffer(zippedFile);
	});
};
