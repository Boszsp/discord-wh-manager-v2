import type { ServerType } from '$lib/components/app/types';
import type { LayoutServerLoad } from './$types';
import { consola } from "consola";

export const load: LayoutServerLoad = async ({ depends }) => {
    depends("servers:get")
    consola.info("Loading server(s)...")
    const servers: ServerType[] = [
        {
            id: '1',
            fallback: 'xx',
            title: 'bg',
            link: '/channel?id=1',
            color: 'red',
        },
        {
            id: '2',
            fallback: 'xx22',
            title: 'bg22',
            link: '/channel?id=2',
        }
    ]
    return {
        servers: servers
    };
};