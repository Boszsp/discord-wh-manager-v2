import type { TemplateSchemaType } from "$lib/schema/templateSchema";
import { consola } from "consola";

export async function createTemplateAction(template: TemplateSchemaType) {
    if (!template) throw new Error("Template Not Define")
    const templateId = "xxx"
    consola.success("CreateTemplateAction",template)

    return {
        status: 200,
        message: "success",
        templateId,
        affectedTemplate: { ...template, id: "xxxzxsd" }
    }
}

export async function editTemplateAction(templateId: string, template: TemplateSchemaType) {
    if (!templateId) throw new Error("Template Id Not Define")
    if (!template) throw new Error("Template Not Define")
    consola.success("EditTemplateAction", template)

    return {
        status: 200,
        message: "success",
        templateId,
        affectedTemplate: template
    }
}

export async function getTemplateAction(templateId: string): Promise<TemplateSchemaType> {
    consola.success("GetTemplateAction")

    return {
        id: "xxx",
        name: "x",
        content: "",
    }
}

export async function getTemplatesAction(offset?: number, limit?: number): Promise<TemplateSchemaType[]> {
    consola.success("GetTemplate(s)Action")

    return [{
        id: "xxx",
        name: "x",
        content: '{"content":"{{xyz}}"}'
    }]
}

export async function removeTemplateAction(templateId: string) {
    consola.success("RemoveTemplateAction")

    return {
        status: 200,
        message: "success",
        templateId,
        affectedTemplate: {
            id: "xxx",
            name: "x",
            url: "xx"
        }
    }

}