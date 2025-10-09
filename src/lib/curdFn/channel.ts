import type { webhookSchemaType } from "$lib/schema/webhookSchema";

export async function createChannelAction(serverId: string, channel: webhookSchemaType) {
    if (!serverId) throw new Error("Server Id Not Define")
    if (!channel) throw new Error("Channel Not Define")

    return {
        status: 200,
        message: "success",
        serverId,
        channel: channel
    }
}

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

export async function getChannel(serverId: string, channelId: string): Promise<webhookSchemaType> {
    return {
        id: "xxx",
        name: "x",
        url: "xx"
    }
}

export async function getChannels(serverId: string,offset?:number,limit?:number): Promise<webhookSchemaType[]> {
    return [{
        id: "xxx",
        name: "x",
        url: "xx"
    }]
}

export async function removeChannel(serverId: string, channelId: string) {
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