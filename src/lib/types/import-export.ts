import type { ServerSchemaType } from "$lib/schema/serverSchema";
import type { TemplateSchemaType } from "$lib/schema/templateSchema";
import type { webhookSchemaType } from "$lib/schema/webhookSchema";

export type OldChannel = {
    id: string;
    name: string;
    link: string;
}

export type NewChannel = webhookSchemaType

export type ExportData = {
    servers: ServerSchemaType[];
    templates: TemplateSchemaType[];
    channels: { serverId: string; channels: NewChannel[] }[];
}