import type { PageLoad } from './$types';
import { get } from 'svelte/store';
import { templateStore } from '$lib/store/template.svelte';
import {consola} from 'consola';


export const load: PageLoad = async ({ url, depends }) => {
    depends("template:get")
    consola.verbose("Loading templates...")
    const restoreData = get(templateStore)
    return {
        templates: restoreData
    };

};

