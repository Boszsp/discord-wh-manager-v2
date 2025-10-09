import { superValidate } from 'sveltekit-superforms/client';
import type { PageLoad } from './$types';
import { zod4 } from 'sveltekit-superforms/adapters';
import { hookJsonPartial } from '$lib/schema/webhookContentSchema';
import { parseNumber } from '$lib/schema/numberSchema';
import { channelCurId } from '$lib/store/channel.svelte';
import { fromStore } from '$lib/store/form.svelte';
import { get } from 'svelte/store';
import { consola } from "consola";
import { DEFAULT_WEBHOOK_CONTENT } from '$lib/default';


export const load: PageLoad = async ({ url, depends }) => {
    depends("template:get")
    consola.info("Loading templates...")

    depends("server:get")
    consola.info("Loading server...")
    
    const serverId = url.searchParams.get('id') ?? '';

    depends("channel:get")
    consola.info("Loading channel...")
    const channelId = url.searchParams.get('channel') ?? '';
    const restoreData = get(fromStore)
    

    consola.info(`In serverId: ${serverId}, At ChannelId: ${channelId}`)
    channelCurId.set({ id: serverId , cid: channelId });
    return {
        form: await superValidate(zod4(hookJsonPartial), {
            defaults: {
                content: DEFAULT_WEBHOOK_CONTENT.content,
                ...restoreData
            }
        }),
        server: {
            id: serverId,
            name: serverId
        },
        channels: [{
            id: channelId,
            name: channelId
        }],
        templates: [
            { name: 'Default' ,content: JSON.stringify(DEFAULT_WEBHOOK_CONTENT)},
        ]
    };

};

