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

export const load: LayoutLoad = async ({ depends, url }) => {

	if (browser) {
		const { pathname } = url;
		const public_paths = ['/login', '/login/', '/login/enckey', '/login/enckey/', '/signup', '/', '', '/default', '/default/'];

		if (public_paths.filter(v => !['/', '', '/default', '/default/'].includes(v)).includes(pathname))
			return {}


		let user = await getCurUserPromise().catch(
			
		)
		//consola.info('Loading user', user);

		if (user && ['/login', '/login/', '/login/enckey', '/login/enckey/', '/signup'].includes(pathname)) {
			throw redirect(307, '/');
		}

		if (!user && !public_paths.includes(pathname)) {
			throw redirect(307, '/login');
		}

		if (!user && public_paths.includes(pathname))return

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
