import { getCurUserPromise } from '$lib/db/auth';
import { db } from '$lib/db/db.schema';
import { DEFAULT_ID_LENGTH } from '$lib/default';
import type { webhookSchemaType } from '$lib/schema/webhookSchema';
import { loadTempCache, saveTempCache } from '$lib/store/temp-cache.svelte';
import { consola } from 'consola';
import { nanoid } from 'nanoid';

type Channel = webhookSchemaType & {};
interface FnResponse {
	status: number,
	message: 'success' | 'error',
	serverId: string,
	affectedChannel: Channel | Partial<Channel>
}

export async function createChannelAction(
	serverId: string,
	channel: Omit<webhookSchemaType, 'id'>
): Promise<FnResponse> {
	if (!serverId) throw new Error('Server ID is not defined');
	if (!channel) throw new Error('Channel data is not defined');

	const curUser = await getCurUserPromise();
	if (!curUser) throw new Error('User is not authenticated');

	const channelId = nanoid(Math.floor(DEFAULT_ID_LENGTH/2));
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
		affectedChannel: { ...dataToSet, id: channelId }
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

	consola.success('EditChannelAction', channel);

	return {
		status: 200,
		message: 'success',
		serverId: serverId,
		affectedChannel: { ...channel, id: channelId }
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

	const cache = loadTempCache(`server-${serverId}-channel-${channelId}`)
	if (cache) {
		consola.success('GetServerChannelAction Cache');
		return cache
	}

	const serverIdRef = await db.servers.id(serverId)
	const channelIdRef = await db.servers(serverIdRef).channels.id(channelId);
	const channelDoc = await db.servers(serverIdRef).channels.get(channelIdRef);
	if (!channelDoc) {
		consola.error('GetChannelAction: Channel not found');
		return null;
	}
	saveTempCache(`server-${serverId}-channel-${channelId}`,channelDoc.data)

	consola.success('GetChannelAction');
	return { ...channelDoc.data, id: channelDoc.ref.id };
}

export async function getChannelsAction(serverId: string): Promise<Channel[]> {
	if (!serverId) throw new Error('Server ID is not defined');
	const curUser = await getCurUserPromise();
	if (!curUser || !curUser.uid) throw new Error('User is not authenticated');
	const cache = loadTempCache(`server-${serverId}-channels`)
	if (cache) {
		consola.success('GetServerChannelActions Cache');
		return cache
	}
	const serverIdRef = await db.servers.id(serverId)
	try {

		const channelDocs = await db
			.servers(serverIdRef)
			.channels.all();
		saveTempCache(`server-${serverId}-channels`, channelDocs.map((doc) => ({ ...doc.data, id: doc.ref.id })))
		consola.success('getChannelsAction');
		return channelDocs.map((doc) => ({ ...doc.data, id: doc.ref.id }));
	} catch (e) {
		consola.error(e);
		return [];
	}
}

export async function removeChannelAction(serverId: string, channelId: string): Promise<FnResponse> {
	if (!serverId) throw new Error('Server ID is not defined');
	if (!channelId) throw new Error('Channel ID is not defined');
	const curUser = await getCurUserPromise();
	if (!curUser) throw new Error('User is not authenticated');
	const serverIdRef = await db.servers.id(serverId)

	const id = db.servers(serverIdRef).channels.id(channelId);
	await db.servers(serverIdRef).channels.remove(id);
	const cache = loadTempCache(`server-${serverId}-channels`)
	if (cache) 
		saveTempCache(`server-${serverId}-channels`, (cache as Channel[])?.filter((doc) => doc.id !== channelId))

	consola.success('removeChannelAction');
	return {
		status: 200,
		message: 'success',
		serverId: serverId,
		affectedChannel: { id: channelId }
	};

}
