import { colorCodeToInteger } from './color';
import { hookJsonPartial } from '$lib/schema/webhookContentSchema';
import { DEFAULT_FILE_LIMIT_COUNT, DEFAULT_FILE_LIMIT_SIZE } from '$lib/default';
import { ofetch } from 'ofetch';
import { consola } from 'consola';

export function cleanUpBlank(obj: any) {
	try {
		for (let k in obj) {
			if (k == 'content') continue;

			if (k == 'color' && typeof obj[k] == 'string') obj[k] = colorCodeToInteger(obj[k]);
			if (k == 'timestamp' && obj[k]) obj[k] = new Date(obj[k]).toISOString();

			if (typeof obj[k] == 'boolean' && (obj?.name?.length > 0 || obj?.value?.length > 0)) continue;
			if (!obj[k] || obj[k]?.length < 1) {
				delete obj[k];
			} else if (typeof obj[k] == 'object' && !obj[k]?.map) {
				cleanUpBlank(obj[k]);
				if (Object.keys(obj[k]).length < 1) {
					delete obj[k];
				}
			} else if (typeof obj[k] == 'object') {
				obj[k].map((i: any) => cleanUpBlank(i));
				obj[k] = obj[k].filter(
					(i: any) =>
						!(
							Object.keys(i).length < 1 ||
							(Object.keys(i).length == 1 && Object.keys(i)?.pop() == 'color')
						)
				);
				if (obj[k].length < 1) delete obj[k];
			}
		}
		return hookJsonPartial.parse(obj);
	} catch (e) {
		consola.error(e);
		return {};
	}
}

export async function sentFilesParallel(url: string, files: File[]) {
	return await Promise.all(
		files.map(async (f) => {
			const formData = new FormData();
			formData.append(`files`, f);
			return ofetch(url, {
				method: 'POST',
				body: f
			});
		})
	);
}

export async function sentFilesSequential(
	url: string,
	files: File[],
	callBack: (mss: string, type?: 'error' | 'success') => void,
	thread_id = undefined
) {
	const query = { wait: true, thread_id };
	let allRes = [];
	let i = 0;
	const imgFile = files.filter((v) => v.type.startsWith('image'));

	const formData1 = new FormData();

	for (let f of imgFile) {
		formData1.append(`files[${i}]`, f);
		if ((i % 10 == 0 && i > 0) || i == imgFile.length - 1) {
			allRes.push(
				await ofetch(url, {
					method: 'POST',
					body: formData1,
					query
				})
					.then((r) => {
						callBack(`sent img file 10 index ${i / 10}`);
						return r;
					})
					.catch((e) => {
						callBack(`sent error img file 10 index ${i / 10}`, 'error');
						return new Error(e);
					})
			);
		}
		i++;
	}

	i = 0;
	files = files.filter((v) => !v.type.startsWith('image'));
	for (let f of files) {
		const formData2 = new FormData();
		formData2.append(`files`, f);
		allRes.push(
			await ofetch(url, {
				method: 'POST',
				body: formData2,
				query
			})
				.then((r) => {
					callBack(`sent file ${f?.name} index ${i}`);
					return r;
				})
				.catch((e) => {
					callBack(`sent error file ${f?.name} index ${i}`, 'error');
					return new Error(e);
				})
		);

		i++;
	}
	return allRes;
}

export async function sendToWebhook(
	url: string,
	data: any,
	files: File[] = [],
	callBack: (mss: string, type?: 'error' | 'success') => void = (
		mss: string,
		type?: 'error' | 'success'
	) => {}
) {
	const payload = JSON.stringify(data);
	const query = { wait: true };
	let thread_id = undefined;
	const allFileSize = Math.floor(files.reduce((acc, file) => acc + file.size, 0) ** (10 ** -6));

	if (
		false &&
		files.length > 0 &&
		files.length < DEFAULT_FILE_LIMIT_COUNT &&
		allFileSize < DEFAULT_FILE_LIMIT_SIZE
	) {
		const formData = new FormData();
		formData.append('payload_json', payload);
		files.forEach((file, i) => {
			formData.append(`files[${i}]`, file);
		});

		const res = await ofetch(url, {
			method: 'POST',
			body: formData,
			query
		})
			.then((r) => {
				callBack(`sent payload`);
				return r;
			})
			.catch((e) => {
				callBack(`sent payload error`, 'error');
				return new Error(e);
			});
		consola.box({ payloadRes: res, filesRes: [] });
		return { payloadRes: res, filesRes: [] };
	} else if (data?.thread_name) {
		const formData = new FormData();
		formData.append('payload_json', payload);
		const imgFile = files.concat([])[0];
		files = files.slice(1);

		if (imgFile && imgFile.type.startsWith('image')) formData.append(`files`, imgFile);

		const res = await ofetch(url, {
			method: 'POST',
			body: formData,
			query
		})
			.then((r) => {
				callBack(`sent payload`);
				return r;
			})
			.catch((e) => {
				callBack(`sent payload error`, 'error');
				return new Error(e);
			});
		if (data?.thread_name && res?.id) {
			console.log(data?.thread_name, res?.id);
			thread_id = res?.id;
		}
		const fileRes = await sentFilesSequential(url, files, callBack, thread_id);
		consola.box({ payloadRes: res, filesRes: fileRes });
		return { payloadRes: res, filesRes: fileRes };
	} else if (payload) {
		const res = await ofetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: payload,
			query
		})
			.then((r) => {
				callBack(`sent payload`);
				return r;
			})
			.catch((e) => {
				callBack(`sent payload error`, 'error');
				return new Error(e);
			});
		if (data?.thread_name && res?.id) {
			console.log(data?.thread_name, res?.id);
			thread_id = res?.id;
		}

		const fileRes = await sentFilesSequential(url, files, callBack, thread_id);
		consola.box({ payloadRes: res, filesRes: fileRes });
		return { payloadRes: res, filesRes: fileRes };
	} else {
		const fileRes = await sentFilesSequential(url, files, callBack, thread_id);
		consola.box({ payloadRes: null, filesRes: fileRes });
		return { payloadRes: null, filesRes: fileRes };
	}
}
