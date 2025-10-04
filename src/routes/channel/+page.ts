import { superValidate } from 'sveltekit-superforms/client';
import type { PageLoad } from './$types';
import { zod4 } from 'sveltekit-superforms/adapters';
import { hookJsonPartial } from '$lib/schema/webhookContentSchema';
import { parseNumber } from '$lib/schema/numberSchema';


export const load: PageLoad = async ({ url, depends }) => {
    depends("server:get")
    const serverId = parseNumber(url.searchParams.get('id') ?? '-1');
    depends("channel:get")
    const channelId = parseNumber(url.searchParams.get('channel') ?? '-1');
    console.log(url.toString())
    return {
        form: await superValidate(zod4(hookJsonPartial),{defaults:{
            content:""
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

