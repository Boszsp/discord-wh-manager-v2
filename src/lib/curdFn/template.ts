import type { TemplateSchemaType } from "$lib/schema/templateSchema";

export async function createTemplate(templateId: string, template: TemplateSchemaType) {
    if (!templateId) throw new Error("Template Id Not Define")
    if (!template) throw new Error("Template Not Define")

    return {
        status: 200,
        message: "success",
        templateId,
        template: template
    }
}

export async function editTemplate(templateId: string, template: TemplateSchemaType) {
    if (!templateId) throw new Error("Template Id Not Define")
    if (!template) throw new Error("Template Not Define")

    return {
        status: 200,
        message: "success",
        templateId,
        affectedTemplate: template
    }
}

export async function getTemplate(templateId: string): Promise<TemplateSchemaType> {
    return {
        id: "xxx",
        name: "x",
        content: "",
    }
}

export async function getTemplates(templateId: string, offset?: number, limit?: number): Promise<TemplateSchemaType[]> {
    return [{
        id: "xxx",
        name: "x",
        content: "",
    }]
}

export async function removeTemplate(templateId: string) {
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