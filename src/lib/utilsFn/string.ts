import { DEFAULT_CODE_HIGHLIGHT_THEME, DEFAULT_COLOR_NUM, DEFAULT_WEBHOOK_CONTENT } from "$lib/default";
import { jsonRegexSchema, jsonSchema } from "$lib/schema/jsonSchema";
import consola from "consola";
import {
    parseTarGzip,
    createTarGzip,
} from "nanotar";
import { codeToHtml } from 'shiki'
import DOMPurify from 'isomorphic-dompurify';


export function convertToFallbackString(str: string) {
    return str.split(" ").slice(0, 3).flatMap(v => v.slice(0, 1).toUpperCase()).join("")
}

export const toHex = (num?: number) => {
    if (!num) num = DEFAULT_COLOR_NUM
    return '#' + num.toString(16).padStart(6, '0');
};

export const toBase64 = (str: string) => {
    if (btoa) return btoa(str)
    return Buffer.from(str).toString('base64')
}

export const toBase64WithGzip = async (str: string) => {
    try {
        return (await createTarGzip([{ name: "data", data: str }])).toString()
    } catch (e) {
        consola.error(e)
        return ""
    }
}

export const toBase64Optimize = async (str: string) => {
    const b1 = toBase64(str)
    return b1
    /* const b2 = toBase64(await toBase64WithGzip(str))
    if (b1?.length > b2?.length) {
        return b2
    }
    return b1*/
}
export function fromBase64(base64String: string): Uint8Array {
    return Uint8Array.from(atob(base64String), (c) => c.charCodeAt(0));
}

export const parseBase64ToJson = async (str: string) => {
    const normalParse = atob(str)
    const { success, error } = jsonRegexSchema.safeParse(normalParse)

    try {
        return jsonSchema.safeParse(JSON.parse(normalParse))?.data
        if (success) {
            return jsonSchema.safeParse(JSON.parse(normalParse))?.data
        }
        else if (normalParse.length > 9) {
            consola.info(error)
            //return jsonSchema.safeParse({ "content": "" })?.data
            //console.log(fromBase64(str))
            //console.log(normalParse?.split(",").map(v => parseInt(v)))
            return parseTarGzip(new Uint8Array(normalParse?.split(",").map(v => parseInt(v))))
        }
        else {
            throw Error("invalid json")
        }
    } catch (e) {
        consola.error(e)
        return jsonSchema.safeParse(DEFAULT_WEBHOOK_CONTENT)?.data
    }

}



export const getInitials = (name: string) => {
    const [firstName, lastName] = name.split(' ');
    if (firstName && lastName) {
        return `${firstName[0]}${lastName[0]}`;
    }
    return firstName[0]
}

/**
 * A comparison function for sorting filenames in natural (human) order.
 * It correctly interprets numeric sequences within strings as numbers.
 *
 * Heuristic: Filenames without any numbers are considered "base" files and
 * will be sorted before filenames with numbers (e.g., 'f.txt' comes before 'f1.txt').
 *
 * @param a - The first filename to compare.
 * @param b - The second filename to compare.
 * @returns A negative number if a comes before b, a positive number if a comes after b, or 0 if they are equal.
 */
export const naturalSort = (a: string, b: string): number => {
    // --- Heuristic: Base files first ---
    // If one filename has numbers and the other doesn't, the one without
    // numbers is considered "smaller" (comes first).
    const aHasNumbers = /\d/.test(a);
    const bHasNumbers = /\d/.test(b);

    if (aHasNumbers && !bHasNumbers) {
        return 1; // b comes first
    }
    if (!aHasNumbers && bHasNumbers) {
        return -1; // a comes first
    }

    // --- Standard Natural Sort Logic ---
    // Helper to split a string into text and number parts.
    const splitIntoParts = (str: string): (string | number)[] => {
        return str.split(/(\d+)/).map(part => {
            return /^\d+$/.test(part) ? parseInt(part, 10) : part;
        });
    };

    const partsA = splitIntoParts(a);
    const partsB = splitIntoParts(b);

    const minLength = Math.min(partsA.length, partsB.length);

    for (let i = 0; i < minLength; i++) {
        const partA = partsA[i];
        const partB = partsB[i];

        if (typeof partA === 'number' && typeof partB === 'number') {
            if (partA !== partB) {
                return partA - partB;
            }
        } else if (typeof partA === 'string' && typeof partB === 'string') {
            const comparison = partA.localeCompare(partB);
            if (comparison !== 0) {
                return comparison;
            }
        } else {
            // If one part is a number and the other is a string, the number is considered "smaller".
            return typeof partA === 'number' ? -1 : 1;
        }
    }

    // If all compared parts are equal, the shorter string comes first.
    return partsA.length - partsB.length;
};


export async function highlightCode(text: string, lang: string): Promise<string> {
    return DOMPurify.sanitize(await codeToHtml(text, { lang , theme:DEFAULT_CODE_HIGHLIGHT_THEME }));
}