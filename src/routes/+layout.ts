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
		const public_paths = ['/login', '/signup', '/', ''];


		if (public_paths.filter(v => !['/', ''].includes(v)).includes(pathname))
			return {}


		let user = await getCurUserPromise()
		consola.info('Loading user', user);

		if (user && public_paths.filter(v => !['/', ''].includes(v)).includes(pathname)) {
			throw redirect(307, '/');
		}

		if (!user && !public_paths.includes(pathname)) {
			throw redirect(307, '/login');
		}

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
		console.log(servers)
		return {
			servers: servers || []
		};
	}



};
