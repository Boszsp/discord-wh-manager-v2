import { error, fail, type Actions } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { superValidate } from "sveltekit-superforms";
import {  zod4 } from 'sveltekit-superforms/adapters';
import { loginSchema } from '$lib/schema/loginSchema';


export const load: PageLoad = async () => {
   
        return {
            form: await superValidate(zod4(loginSchema))
        };
    

};

