import type { TemplateSchemaType } from "$lib/schema/templateSchema";

export async function createTemplateAction(templateId: string, template: TemplateSchemaType) {
    if (!templateId) throw new Error("Template Id Not Define")
    if (!template) throw new Error("Template Not Define")

    return {
        status: 200,
        message: "success",
        templateId,
        template: template
    }
}

export async function editTemplateAction(templateId: string, template: TemplateSchemaType) {
    if (!templateId) throw new Error("Template Id Not Define")
    if (!template) throw new Error("Template Not Define")

    return {
        status: 200,
        message: "success",
        templateId,
        affectedTemplate: template
    }
}

export async function getTemplateAction(templateId: string): Promise<TemplateSchemaType> {
    return {
        id: "xxx",
        name: "x",
        content: "",
    }
}

export async function getTemplatesAction(templateId: string, offset?: number, limit?: number): Promise<TemplateSchemaType[]> {
    return [{
        id: "xxx",
        name: "x",
        content: "",
    }]
}

export async function removeTemplateAction(templateId: string) {
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