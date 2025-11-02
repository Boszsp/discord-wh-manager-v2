import type { PageLoad } from './$types';
import { hookJsonPartial } from '$lib/schema/webhookContentSchema';
import { parseBase64ToJson } from '$lib/utilsFn/string';
import { consola } from 'consola';
import { DEFAULT_WEBHOOK_CONTENT } from '$lib/default';
export const load: PageLoad = async ({ url }) => {
	const data = url.searchParams.get('data');

	const pasredData = hookJsonPartial.safeParse(await parseBase64ToJson(data ?? ''));
	if (pasredData.success) consola.success('Pasred Data', pasredData?.data);
	else consola.error(pasredData?.error);

	return {
		formData: pasredData.success
			? (pasredData?.data ?? DEFAULT_WEBHOOK_CONTENT)
			: DEFAULT_WEBHOOK_CONTENT
	};
};
