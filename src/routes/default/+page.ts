
import { superValidate } from 'sveltekit-superforms/client';
import type { PageLoad } from './$types';
import { zod4 } from 'sveltekit-superforms/adapters';
import { hookJsonPartial } from '$lib/schema/webhookContentSchema';
import { parseBase64ToJson } from '$lib/utilsFn/string';

export const load: PageLoad = async ({ url }) => {
    const data = url.searchParams.get('data')

    const pasredData = hookJsonPartial.safeParse(await parseBase64ToJson(data ?? ""))
    console.log(pasredData?.data)
    return {
        formData: pasredData.success ? pasredData?.data ?? { content: '' } : { content: '' }
    }
        
};
