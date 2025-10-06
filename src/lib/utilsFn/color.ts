import z from "zod";

const COLOR_MAP: Record<string, string> = {
    aliceblue: "#f0f8ff",
    antiquewhite: "#faebd7",
    aqua: "#00ffff",
    aquamarine: "#7fffd4",
    azure: "#f0ffff",
    beige: "#f5f5dc",
    bisque: "#ffe4c4",
    black: "#000000",
    blue: "#0000ff",
    brown: "#a52a2a",
    coral: "#ff7f50",
    crimson: "#dc143c",
    cyan: "#00ffff",
    fuchsia: "#ff00ff",
    gold: "#ffd700",
    gray: "#808080",
    green: "#008000",
    indigo: "#4b0082",
    ivory: "#fffff0",
    khaki: "#f0e68c",
    lavender: "#e6e6fa",
    lime: "#00ff00",
    magenta: "#ff00ff",
    maroon: "#800000",
    navy: "#000080",
    olive: "#808000",
    orange: "#ffa500",
    pink: "#ffc0cb",
    purple: "#800080",
    red: "#ff0000",
    silver: "#c0c0c0",
    teal: "#008080",
    violet: "#ee82ee",
    white: "#ffffff",
    yellow: "#ffff00",
};

export function colorNameToHex(name: string): string | null {
    if (name.startsWith("#")) return name.toLowerCase()
    return COLOR_MAP[name.toLowerCase()] ?? null;
}

export function colorCodeToInteger(colorCode:string) {
    colorCode = z.string().regex(/#[0-9a-fA-F]{3,8}/).parse(colorCode)
    if (typeof colorCode === "string" && colorCode.startsWith("#") && colorCode.length > 3) {
        return parseInt(colorCode.slice(1), 16);
    }
    return null; 
}
