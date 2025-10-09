export const prerender = true;
export const trailingSlash = 'always'
export const ssr = false;

import type { ServerType } from '$lib/components/app/types';
import { getServersAction } from '$lib/curdFn/server';
import type { LayoutLoad } from './$types';
import { consola } from "consola";

export const load: LayoutLoad = async ({ depends }) => {
    depends("servers:get")
    consola.info("Loading server(s)...")

    /**
     *  id: '2',
            fallback: 'xx22',
            title: 'bg22',
            link: '/channel?id=2',
     */
    const servers: ServerType[] = (await getServersAction())?.map((v) => ({ id: v?.id || "", color: v?.color, title: v?.name, link: `/channel?id=${v?.id}`, }))
    return {
        servers: servers
    };
};