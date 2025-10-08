import { DEFAULT_WEBHOOK_CONTENT } from "$lib/default";
import { hookJsonPartial,type hookJsonPartialSchemaType } from "$lib/schema/webhookContentSchema";
import consola from "consola";

export function safePareseTemplateString(str: string,retureOnErrorValue:hookJsonPartialSchemaType) {
    try {
        const {data,success} = hookJsonPartial.safeParse(JSON.parse(str));
        if(success)
        return  data
        else
            return retureOnErrorValue ?? DEFAULT_WEBHOOK_CONTENT
    }catch (e) {
        consola.error(e)
        return retureOnErrorValue?? DEFAULT_WEBHOOK_CONTENT
    }
}