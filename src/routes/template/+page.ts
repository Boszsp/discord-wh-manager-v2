import type { PageLoad } from './$types';
import { get } from 'svelte/store';
import { templateStore } from '$lib/store/template.svelte';
import {consola} from 'consola';
import { getTemplatesAction } from '$lib/curdFn/template';


export const load: PageLoad = async ({ url, depends }) => {
    depends("template:get")
    consola.info("Loading templates...")
    const templates = await getTemplatesAction()
    return {
        templates: templates
    };

};

