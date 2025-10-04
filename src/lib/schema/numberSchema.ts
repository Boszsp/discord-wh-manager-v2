import z from "zod";
import { consola } from "consola/browser";
export const strNumberSchema = z.string().transform(
    (s)=>parseInt(s)
)

export const numberSchema = z.number()

export function parseNumber(numStr: string) {
    const { data, error } = strNumberSchema.safeParse(numStr)
    if (error?.message) {
        consola.error(error.message)
        return -1
    }
    const { data:num, error:errNum } = numberSchema.safeParse(data)
     if (errNum?.message) {
        consola.error(errNum.message)
        return -1
    }
    return num
}