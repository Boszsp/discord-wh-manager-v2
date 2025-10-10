import type { webhookSchemaType } from "$lib/schema/webhookSchema";
import { consola } from "consola";

export async function createChannelAction(serverId: string, channel: webhookSchemaType) {
    if (!serverId) throw new Error("Server Id Not Define")
    if (!channel) throw new Error("Channel Not Define")
    consola.success("createChannelAction")

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

    return {
        status: 200,
        message: "success",
        serverId,
        channelId,
        affectedChannel: channel
    }
}

export async function getChannelAction(serverId: string, channelId: string): Promise<webhookSchemaType> {
    return {
        id: "xxx",
        name: "x",
        url: "xx"
    }
}

export async function getChannelsAction(serverId: string,offset?:number,limit?:number): Promise<webhookSchemaType[]> {
    return [{
        id: "xxx",
        name: "x",
        url: "xx"
    }]
}

export async function removeChannelAction(serverId: string, channelId: string) {
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