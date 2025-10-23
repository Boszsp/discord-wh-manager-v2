import { db } from '$lib/db/db.schema';
import { webhookSchema, type webhookSchemaType } from '$lib/schema/webhookSchema';
import { consola } from 'consola';

export async function createChannelAction(serverId: string, channel: webhookSchemaType) {
	if (!serverId) throw new Error('Server Id Not Define');
	if (!channel) throw new Error('Channel Not Define');
	consola.success('CreateChannelAction At Server ', serverId, ' Value ', channel);

	return {
		status: 200,
		message: 'success',
		serverId,
		affectedChannel: Object.assign(channel, { id: 'xyz' })
	};
}

export type createChannelActionType = typeof createChannelAction;

export async function editChannelAction(
	serverId: string,
	channelId: string,
	channel: webhookSchemaType
) {
	if (!serverId) throw new Error('Server Id Not Define');
	if (!channelId) throw new Error('Channel Id Not Define');
	if (!channel) throw new Error('Channel Not Define');
	consola.success(
		'EditChannelAction At Server ',
		serverId,
		' Channel ',
		channelId,
		' Value ',
		channel
	);

	return {
		status: 200,
		message: 'success',
		serverId,
		channelId,
		affectedChannel: channel
	};
}

export async function getChannelAction(
	serverId: string,
	channelId: string
): Promise<webhookSchemaType> {
	try {
		if (!serverId && serverId?.length > 1) {
			throw new Error('Server Id Require');
		}
		if (!channelId && channelId?.length > 1) {
			throw new Error('Channel Id Require');
		}
		const serverIdf = db.servers.id(serverId);
		const channelIdf = db.servers(serverIdf).channels.id(channelId);
		const res = await db.servers(serverIdf).channels.get(channelIdf);
		consola.success('GetChannelAction At Server ', serverId, ' Channel ', channelId);
		return res?.data as webhookSchemaType;
	} catch (e) {
		consola.error(e);
		return {
			id: 'xxx',
			name: 'x',
			url: 'xx'
		};
	}
}

export async function getChannelsAction(
	serverId: string,
	offset?: number,
	limit?: number
): Promise<webhookSchemaType[]> {
	try {
		if (!serverId && serverId?.length > 1) throw new Error('Server Id Require');
		consola.success('GetChannel(s)Action At Server ', serverId);
		const serverIdf = db.servers.id(serverId);
		const res = await db.servers(serverIdf).channels.all();
		return res?.map((v) => v.data) as webhookSchemaType[];
	} catch (e) {
		consola.error(e);
		return [];
	}
}

export async function removeChannelAction(serverId: string, channelId: string) {
	if (!serverId) throw new Error('Server Id Not Define');
	if (!channelId) throw new Error('Channel Id Not Define');
	consola.success('RemoveChannelAction At Server ', serverId, ' Channel ', channelId);

	return {
		status: 200,
		message: 'success',
		serverId,
		channelId,
		affectedChannel: {
			id: 'xxx',
			name: 'x',
			url: 'xx'
		}
	};
}
