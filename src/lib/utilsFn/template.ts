import { DEFAULT_WEBHOOK_CONTENT } from "$lib/default";
import { hookJsonFullyPartialSchema,type hookJsonPartialSchemaType } from "$lib/schema/webhookContentSchema";
import consola from "consola";

export function safePareseTemplateString(str: string,retureOnErrorValue:hookJsonPartialSchemaType) {
    try {
        const {data,success,error} = hookJsonFullyPartialSchema.safeParse(JSON.parse(str));
        if(success)
        return retureOnErrorValue ? Object.assign(retureOnErrorValue,data) : data
        else{
            consola.error("Error parsing template string:",error)
            return retureOnErrorValue ?? DEFAULT_WEBHOOK_CONTENT
        }
    }catch (e) {
        consola.error(e)
        return retureOnErrorValue?? DEFAULT_WEBHOOK_CONTENT
    }
}