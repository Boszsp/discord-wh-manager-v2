import { user } from '$lib/store/auth.svelte';
import { db } from '$lib/db/db.schema';
import type { ServerSchemaType } from '$lib/schema/serverSchema';
import { consola } from 'consola';
import { nanoid } from 'nanoid';

export async function createServerAction(server: ServerSchemaType) {
	if (!server) throw new Error('Server Not Define');
	const serverId = nanoid(8);
	const curUser = await user.awaitUser();
	if (!curUser) throw new Error('User Not Define');
	await db.servers.set(db.servers.id(serverId), {
		name: server.name,
		color: server.color,
		create_by: curUser?.uid
	});

	consola.success('CreateServerAction', server);
	return {
		status: 200,
		message: 'success',
		serverId: serverId,
		affectedServer: server
	};
}

export async function editServerAction(serverId: string, server: ServerSchemaType) {
	if (!serverId) throw new Error('Server Id Not Define');
	if (!server) throw new Error('Server Not Define');
	consola.success('EditServerAction', server);
	return {
		status: 200,
		message: 'success',
		serverId,
		affectedServer: server
	};
}

export async function getServerAction(serverId: string): Promise<ServerSchemaType> {
	consola.success('GetServerAction');
	return {
		id: 'xxx',
		name: 'x'
	};
}

export async function getServersAction(
	offset?: number,
	limit?: number
): Promise<ServerSchemaType[]> {
	consola.success('GetServer(s)Action');
	try {
		const servers = await db.servers.all();
		console.log(servers);
		return servers.map((v) => ({ id: v.data?.id || '', name: v.data?.name || '' }));
	} catch (e) {
		consola.error(e);
		return [
			{
				id: 'xxx',
				name: 'xxx'
			}
		];
	}
}

export async function removeServerAction(serverId: string) {
	consola.success('RemoveServerAction');

	return {
		status: 200,
		message: 'success',
		serverId,
		affectedServer: {
			id: 'xxx',
			name: 'x',
			url: 'xx'
		}
	};
}
