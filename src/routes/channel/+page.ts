import { superValidate } from 'sveltekit-superforms/client';
import type { PageLoad } from './$types';
import { zod4 } from 'sveltekit-superforms/adapters';
import { hookJsonPartial } from '$lib/schema/webhookContentSchema';
import { parseNumber } from '$lib/schema/numberSchema';
import { channelCurId } from '$lib/store/channel.svelte';
import { fromStore } from '$lib/store/form.svelte';
import { get } from 'svelte/store';


export const load: PageLoad = async ({ url, depends }) => {
    depends("server:get")
    const serverId = parseNumber(url.searchParams.get('id') ?? '-1');
    console.log(serverId, url.searchParams.get('id'))

    depends("channel:get")
    const channelId = parseNumber(url.searchParams.get('channel') ?? '1');
    const restoreData = get(fromStore)

    channelCurId.set({ id: serverId ?? -1, cid: channelId ?? -1 });
    return {
        form: await superValidate(zod4(hookJsonPartial),{defaults:{
            content:"",
            ...restoreData
        }}),
        server:{
            id:serverId,
            name: serverId
        },
        channel:{
            id:channelId,
            name:channelId
        }
    };

};

