import type { ServerSchemaType } from "$lib/schema/serverSchema";

export async function createServer(serverId: string, server: ServerSchemaType) {
    if (!serverId) throw new Error("Server Id Not Define")
    if (!server) throw new Error("Server Not Define")

    return {
        status: 200,
        message: "success",
        serverId,
        server: server
    }
}

export async function editServer(serverId: string,server: ServerSchemaType) {
    if (!serverId) throw new Error("Server Id Not Define")
    if (!server) throw new Error("Server Not Define")

    return {
        status: 200,
        message: "success",
        serverId,
        affectedServer: server
    }
}

export async function getServer(serverId: string): Promise<ServerSchemaType> {
    return {
        id: "xxx",
        name: "x"
    }
}

export async function getServers(serverId: string,offset?:number,limit?:number): Promise<ServerSchemaType[]> {
    return [{
        id: "xxx",
        name: "x",
    }]
}

export async function removeServer(serverId: string) {
    return {
        status: 200,
        message: "success",
        serverId,
        affectedServer: {
            id: "xxx",
            name: "x",
            url: "xx"
        }
    }

}