import { getCurUserPromise } from '$lib/db/auth';
import { db } from '$lib/db/db.schema';
import type { webhookSchemaType } from '$lib/schema/webhookSchema';
import { consola } from 'consola';
import { nanoid } from 'nanoid';

type Channel = webhookSchemaType & {  };
interface FnResponse {
	status: number,
	message: 'success' | 'error',
	serverId: string,
	affectedServer: Channel | Partial<Channel>
}

export async function createChannelAction(
	serverId: string,
	channel: Omit<webhookSchemaType, 'id'>
): Promise<FnResponse> {
	if (!serverId) throw new Error('Server ID is not defined');
	if (!channel) throw new Error('Channel data is not defined');

	const curUser = await getCurUserPromise();
	if (!curUser) throw new Error('User is not authenticated');

	const channelId = nanoid();
	const serverIdRef = await db.servers.id(serverId)
	const channelRef = db.servers(serverIdRef).channels.id(channelId);

	const dataToSet = {
		...channel
	};

	await db.servers(serverIdRef).channels.set(channelRef, dataToSet);

	consola.success('createChannelAction', dataToSet);

	return {
		status: 200,
		message: 'success',
		serverId: serverId,
		affectedServer: { ...dataToSet, id: channelId }
	};
}

export async function editChannelAction(
	serverId: string,
	channelId: string,
	channel: Partial<webhookSchemaType>
): Promise<FnResponse> {
	if (!serverId) throw new Error('Server ID is not defined');
	if (!channelId) throw new Error('Channel ID is not defined');
	if (!channel) throw new Error('Channel data is not defined');
	const curUser = await getCurUserPromise();
	if (!curUser) throw new Error('User is not authenticated');
	const serverIdRef = await db.servers.id(serverId)
	const id = db.servers(serverIdRef).channels.id(channelId);
	await db.servers(serverIdRef).channels.update(id, channel);

	consola.success('editChannelAction', channel);

	return {
		status: 200,
		message: 'success',
		serverId: serverId,
		affectedServer: { ...channel, id: channelId }
	};
}

export async function getChannelAction(
	serverId: string,
	channelId: string
): Promise<Channel | null> {
	if (!serverId) throw new Error('Server ID is not defined');
	if (!channelId) throw new Error('Channel ID is not defined');
	const curUser = await getCurUserPromise();
	if (!curUser) throw new Error('User is not authenticated');
	const serverIdRef = await db.servers.id(serverId)
	const channelIdRef = await db.servers(serverIdRef).channels.id(channelId);
	const channelDoc = await db.servers(serverIdRef).channels.get(channelIdRef);
	if (!channelDoc) {
		consola.error('getChannelAction: Channel not found');
		return null;
	}

	consola.success('getChannelAction');
	return { ...channelDoc.data, id: channelDoc.ref.id };
}

export async function getChannelsAction(serverId: string): Promise<Channel[]> {
	if (!serverId) throw new Error('Server ID is not defined');
	const curUser = await getCurUserPromise();
	if (!curUser || !curUser.uid) throw new Error('User is not authenticated');
	const serverIdRef = await db.servers.id(serverId)
	try {

		const channelDocs = await db
			.servers(serverIdRef)
			.channels.all();
		consola.success('getChannelsAction');
		return channelDocs.map((doc) => ({ ...doc.data, id: doc.ref.id }));
	} catch (e) {
		consola.error(e);
		return [];
	}
}

export async function removeChannelAction(serverId: string, channelId: string) {
	if (!serverId) throw new Error('Server ID is not defined');
	if (!channelId) throw new Error('Channel ID is not defined');
	const curUser = await getCurUserPromise();
	if (!curUser) throw new Error('User is not authenticated');
	const serverIdRef = await db.servers.id(serverId)

	const id = db.servers(serverIdRef).channels.id(channelId);
	await db.servers(serverIdRef).channels.remove(id);

	consola.success('removeChannelAction');
	return { id: channelId };
}
