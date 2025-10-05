import consola from "consola";
import { colorCodeToInteger } from "./color";

export function cleanUpBlank(obj:any) {
    try{
    for (let k in obj) {
        if (k == "content") continue;

        if (k == "color" && typeof obj[k] == "string") obj[k] = colorCodeToInteger(obj[k]);
        if (k == "timestamp" && obj[k]) obj[k] = new Date(obj[k]).toISOString();

        if (typeof obj[k] == "boolean" && (obj?.name?.length > 0 || obj?.value?.length > 0)) continue;
        if (!obj[k] || obj[k]?.length < 1) {
            delete obj[k];
        } else if (typeof obj[k] == "object" && !obj[k]?.map) {
            cleanUpBlank(obj[k]);
            if (Object.keys(obj[k]).length < 1) {
                delete obj[k];
            }
        } else if (typeof obj[k] == "object") {
            obj[k].map((i:any) => cleanUpBlank(i));
            obj[k] = obj[k].filter((i:any) => !(Object.keys(i).length < 1 || (Object.keys(i).length == 1 && Object.keys(i)?.pop() == "color")));
            if (obj[k].length < 1) delete obj[k];
        }
    }
    return obj;
}catch (e){
    consola.error(e)
    return {}
}
}

