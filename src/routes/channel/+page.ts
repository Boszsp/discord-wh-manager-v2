import { superValidate } from 'sveltekit-superforms/client';
import type { PageLoad } from './$types';
import { zod4 } from 'sveltekit-superforms/adapters';
import { hookJsonPartial } from '$lib/schema/webhookContentSchema';


export const load: PageLoad = async ({ url, depends }) => {
    depends("channel:get")
    console.log(url)
    return {
        form: await superValidate(zod4(hookJsonPartial),{defaults:{
            content:""
        }})
    };

};

