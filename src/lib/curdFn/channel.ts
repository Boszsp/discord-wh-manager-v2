import { db } from "$lib/db/db.schema";
import { webhookSchema, type webhookSchemaType } from "$lib/schema/webhookSchema";
import { consola } from "consola";

export async function createChannelAction(serverId: string, channel: webhookSchemaType) {
    if (!serverId) throw new Error("Server Id Not Define")
    if (!channel) throw new Error("Channel Not Define")
    consola.success("CreateChannelAction At Server ",serverId," Value ",channel)
    
    return {
        status: 200,
        message: "success",
        serverId,
        affectedChannel: Object.assign(channel,{id:"xyz"})
    }
}

export type createChannelActionType = typeof createChannelAction

export async function editChannelAction(serverId: string, channelId: string, channel: webhookSchemaType) {
    if (!serverId) throw new Error("Server Id Not Define")
    if (!channelId) throw new Error("Channel Id Not Define")
    if (!channel) throw new Error("Channel Not Define")
    consola.success("EditChannelAction At Server ", serverId, " Channel ", channelId, " Value ", channel)


    return {
        status: 200,
        message: "success",
        serverId,
        channelId,
        affectedChannel: channel
    }
}

export async function getChannelAction(serverId: string, channelId: string): Promise<webhookSchemaType> {
    const serverIdf = db.servers.id(serverId);
    const channelIdf = db.servers(serverIdf).channels.id(channelId)

    await db.servers(serverIdf).channels.get(channelIdf)
    consola.success("GetChannelAction At Server ", serverId, " Channel ", channelId)
    return {
        id: "xxx",
        name: "x",
        url: "xx"
    }
}

export async function getChannelsAction(serverId: string,offset?:number,limit?:number): Promise<webhookSchemaType[]> {
    consola.success("GetChannel(s)Action At Server ", serverId)
    const serverIdf = db.servers.id(serverId);
    const res = (await db.servers(serverIdf).channels.all()).map(v =>v.data)
    return res as webhookSchemaType[]
}

export async function removeChannelAction(serverId: string, channelId: string) {
    if (!serverId) throw new Error("Server Id Not Define")
    if (!channelId) throw new Error("Channel Id Not Define")
    consola.success("RemoveChannelAction At Server ", serverId, " Channel ", channelId)

    return {
        status: 200,
        message: "success",
        serverId,
        channelId,
        affectedChannel: {
            id: "xxx",
            name: "x",
            url: "xx"
        }
    }

}