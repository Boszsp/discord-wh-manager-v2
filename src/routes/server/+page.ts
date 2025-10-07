
import type { PageLoad } from './$types';
import { consola } from "consola";
export const load: PageLoad = async ({ url }) => {


    return {
        server: [
            { id: '1', name: 'Production Server', color: 'red' },
            { id: '2', name: 'Staging Server', color: 'green' },
            { id: '3', name: 'Development Server' }
        ]
    }

};
