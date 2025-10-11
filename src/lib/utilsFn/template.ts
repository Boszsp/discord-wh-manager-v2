import { DEFAULT_WEBHOOK_CONTENT } from "$lib/default";
import { hookJsonFullyPartialSchema,type hookJsonPartialSchemaType } from "$lib/schema/webhookContentSchema";
import consola from "consola";

export function safePareseTemplateString(str: string, retureOnErrorValue?: hookJsonPartialSchemaType ) {
    try {
        const {data,success,error} = hookJsonFullyPartialSchema.safeParse(JSON.parse(str));
        if(success)
        return retureOnErrorValue ? Object.assign(retureOnErrorValue,data) : data
        else{
            consola.error("Error parsing template string:",error)
            return retureOnErrorValue ?? DEFAULT_WEBHOOK_CONTENT
        }
    }catch (e) {
        consola.error(e, str)
        return retureOnErrorValue?? DEFAULT_WEBHOOK_CONTENT
    }
}

export function extractVariables(content: string): string[] {
    const regex = /{{\s*(\w+)\s*}}/g;
    const matches = content.match(regex);
    if (!matches) {
        return [];
    }
    return [...new Set(matches.map(match => match.replace(/{|}/g, "").trim()))];
}

export function applyTemplate(variables:Record<string,string>,content:string):string{
    for (const variable in variables) {
        content = content.replaceAll(`{{${variable}}}`, variables[variable])
    }
    return content
}