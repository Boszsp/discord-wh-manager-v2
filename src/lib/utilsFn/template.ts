import { DEFAULT_WEBHOOK_CONTENT } from "$lib/default";
import { hookJsonPartial } from "$lib/schema/webhookContentSchema";
import consola from "consola";

export function safePareseTemplateString(str: string) {
    try {
        const {data,success} = hookJsonPartial.safeParse(JSON.parse(str));
        if(success)
        return  data
        else
            return DEFAULT_WEBHOOK_CONTENT
    }catch (e) {
        consola.error(e)
        return DEFAULT_WEBHOOK_CONTENT
    }
}