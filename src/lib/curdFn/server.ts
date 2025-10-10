import type { ServerSchemaType } from "$lib/schema/serverSchema";
import { consola } from "consola";

export async function createServerAction(server: ServerSchemaType) {
    if (!server) throw new Error("Server Not Define")
    consola.success("CreateServerAction", server)

    return {
        status: 200,
        message: "success",
        serverId: "cyx",
        affectedServer: server
    }
}

export async function editServerAction(serverId: string, server: ServerSchemaType) {
    if (!serverId) throw new Error("Server Id Not Define")
    if (!server) throw new Error("Server Not Define")
    consola.success("EditServerAction", server)
    return {
        status: 200,
        message: "success",
        serverId,
        affectedServer: server
    }
}

export async function getServerAction(serverId: string): Promise<ServerSchemaType> {
    consola.success("GetServerAction")
    return {
        id: "xxx",
        name: "x"
    }
}

export async function getServersAction(offset?: number, limit?: number): Promise<ServerSchemaType[]> {
    consola.success("GetServer(s)Action")

    return [{
        id: "xxx",
        name: "xxx",
    }]
}

export async function removeServerAction(serverId: string) {
    consola.success("RemoveServerAction")

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