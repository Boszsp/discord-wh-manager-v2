import type { ServerSchemaType } from "$lib/schema/serverSchema";

export async function createServerAction( server: ServerSchemaType) {
    if (!server) throw new Error("Server Not Define")

    return {
        status: 200,
        message: "success",
        serverId:"cyx",
        server: server
    }
}

export async function editServerAction(serverId: string,server: ServerSchemaType) {
    if (!serverId) throw new Error("Server Id Not Define")
    if (!server) throw new Error("Server Not Define")

    return {
        status: 200,
        message: "success",
        serverId,
        affectedServer: server
    }
}

export async function getServerAction(serverId: string): Promise<ServerSchemaType> {
    return {
        id: "xxx",
        name: "x"
    }
}

export async function getServersAction(offset?:number,limit?:number): Promise<ServerSchemaType[]> {
    return [{
        id: "xxx",
        name: "xxx",
    }]
}

export async function removeServerAction(serverId: string) {
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