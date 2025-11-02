import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';

export const prerender = true;
export const trailingSlash = 'always';
export const ssr = false;

import type { ServerType } from '$lib/components/app/types';
import { getServersAction } from '$lib/curdFn/server';
import type { LayoutLoad } from './$types';
import { consola } from 'consola';
import { getCurUserPromise } from '$lib/db/auth';
import { DEFAULT_LOCAL_ENC_KEY } from '$lib/default';
import { loadFromLocalStorage } from '$lib/store/local-storage-cache.svelte';

export const load: LayoutLoad = async ({ depends, url }) => {

	if (browser) {
		const { pathname } = url;
		const public_paths = ['/login', '/login/', '/login/enckey', '/login/enckey/', '/signup', '/', '', '/home', '/home/', '/default', '/default/'];

		//if (public_paths.filter(v => !['/', '', '/default', '/default/', '/home', '/home/'].includes(v)).includes(pathname))
		//	return {}
		
		//consola.info(pathname)

		let user = await getCurUserPromise().catch()
		//consola.info('Loading user', user);
		const enckey = loadFromLocalStorage(DEFAULT_LOCAL_ENC_KEY)

		if (user && pathname.startsWith("/login/enckey")) return
		if (user && !enckey) {
			throw redirect(302, '/login/enckey');
		}

		if (user && ['/login', '/login/', '/login/enckey', '/login/enckey/', '/signup'].includes(pathname)) {
			throw redirect(302, '/');
		}

		if((!user) && pathname.startsWith("/login"))return

		if (!(user || public_paths.includes(pathname))) {
			throw redirect(302, '/login');
		}

		if ((!user) && public_paths.includes(pathname)) return

		depends('servers:get');
		consola.info('Loading server(s)...');

		/**
		 *  id: '2',
				fallback: 'xx22',
				title: 'bg22',
				link: '/channel?id=2',
		 */
		const servers: ServerType[] =
			(await getServersAction())?.map((v) => ({
				id: v?.id || '',
				color: v?.color || '',
				title: v?.name,
				link: `/channel?id=${v?.id}`
			})) ?? [];
		return {
			servers: servers || []
		};
	}



};
