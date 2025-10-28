import { getCurUserPromise } from '$lib/db/auth';
import { db } from '$lib/db/db.schema';
import type { ServerSchemaType } from '$lib/schema/serverSchema';
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

	const serverId = nanoid();
	const serverRef = db.servers.id(serverId);

	const dataToSet = {
		...server,
		create_by: curUser.uid
	};

	await db.servers.set(serverRef, dataToSet);

	consola.success('createServerAction', dataToSet);

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

	consola.success('editServerAction', server);

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

	try {
		const serverDocs = await db.servers.query(($) => $.field('create_by').eq(curUser.uid));
		consola.success('getServersAction');
		return serverDocs.map((doc) => ({ ...doc.data, id: doc.ref.id }));
	} catch (e) {
		consola.error(e);
		return [];
	}
}

export async function removeServerAction(serverId: string) {
	if (!serverId) throw new Error('Server ID is not defined');

	const id = db.servers.id(serverId);
	await db.servers.remove(id);

	consola.success('removeServerAction');
	return { id: serverId };
}