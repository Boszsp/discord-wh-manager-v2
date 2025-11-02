import { invalidate } from '$app/navigation';
import { getCurUserPromise } from '$lib/db/auth';
import { db } from '$lib/db/db.schema';
import { DEFAULT_ID_LENGTH } from '$lib/default';
import type { ServerSchemaType } from '$lib/schema/serverSchema';
import { loadTempCache, saveTempCache, updateTempCache } from '$lib/store/temp-cache.svelte';
import { consola } from 'consola';
import { nanoid } from 'nanoid';

type Server = ServerSchemaType & { create_by?: string };
interface FnResponse{
	status: number,
	message: 'success' | 'error',
	serverId: string,
	affectedServer: Server | Partial<ServerSchemaType>
}

export async function createServerAction(server: Omit<ServerSchemaType, 'id'>): Promise<FnResponse> {
	if (!server) throw new Error('Server data is not defined');
	const curUser = await getCurUserPromise();
	if (!curUser) throw new Error('User is not authenticated');

	const serverId = nanoid(DEFAULT_ID_LENGTH);
	const serverRef = db.servers.id(serverId);

	const dataToSet = {
		...server,
		create_by: curUser.uid
	};
	console.log(serverRef, dataToSet)
	await db.servers.set(serverRef, dataToSet);
	updateTempCache(`servers-${curUser.uid}`, { ...dataToSet, id: serverId })
	consola.success('createServerAction', {...dataToSet,id:serverId});
	invalidate("servers:get")
	return {
		status: 200,
		message: 'success',
		serverId: serverId,
		affectedServer: {...dataToSet,id:serverId}
	};
}

export async function editServerAction(
	serverId: string,
	server: Partial<ServerSchemaType>
): Promise<FnResponse> {
	if (!serverId) throw new Error('Server ID is not defined');
	if (!server) throw new Error('Server data is not defined');
	const curUser = await getCurUserPromise();
	if (!curUser) throw new Error('User is not authenticated');

	const id = db.servers.id(serverId);
	await db.servers.update(id, server);
	updateTempCache(`servers-${curUser.uid}`, {...server,id:serverId}, serverId)
	consola.success('editServerAction', server);
	invalidate("servers:get")
	return {
		status: 200,
		message: 'success',
		serverId: serverId,
		affectedServer: {name:String(server?.name),color:server?.color,id:serverId,create_by: undefined}
	};
	
}

export async function getServerAction(serverId: string): Promise<Partial<Server> | null> {
	if (!serverId) throw new Error('Server ID is not defined');
	const curUser = await getCurUserPromise();
	if (!curUser) throw new Error('User is not authenticated');
	const id = db.servers.id(serverId);
	const serverDoc = await db.servers.get(id);

	if (!serverDoc) {
		consola.error('getServerAction: Server not found');
		return null;
	}

	consola.success('getServerAction');
	
	return { ...serverDoc.data , id:serverDoc?.ref?.id  };
}

export async function getServersAction(): Promise<Server[]> {
	const curUser = await getCurUserPromise();
	if (!curUser || !curUser.uid) throw new Error('User is not authenticated');
	const cache = loadTempCache(`servers-${curUser.uid}`)
	if (cache){
		 consola.success('GetServersAction Cache');
		 return cache
	}

	try {
		const serverDocs = await db.servers.query(($) => $.field('create_by').eq(curUser.uid));
		if (!cache)saveTempCache(`servers-${curUser.uid}`,serverDocs.map((doc) => ({ ...doc.data, id: doc.ref.id })))
		consola.success('GetServersAction');
		return serverDocs.map((doc) => ({ ...doc.data, id: doc.ref.id }));
	} catch (e) {
		consola.error(e);
		return [];
	}
}

export async function removeServerAction(serverId: string) {
	if (!serverId) throw new Error('Server ID is not defined');
	const curUser = await getCurUserPromise();
	if (!curUser || !curUser.uid) throw new Error('User is not authenticated');
	const id = db.servers.id(serverId);
	await db.servers.remove(id);
	updateTempCache(`servers-${curUser.uid}`,undefined,serverId)
	consola.success('removeServerAction');
	invalidate("servers:get")
	return { id: serverId };
}