import type { LayoutServerLoad } from './$types';
import { consola } from "consola";

export const load: LayoutServerLoad = async ({depends}) => {
    depends("servers:get")
    consola.info("Loading server(s)...")
    return {
        servers: [
            {
                fallback: 'xx',
                title: 'bg',
                link: '/channel?id=1',
                color: 'red',
            },
            {
                fallback: 'xx22',
                title: 'bg22',
                link: '/channel?id=2',
            }
        ]
    };
};