import { DEFAULT_COLOR_NUM } from "$lib/default";

export function convertToFallbackString(str: string) {
    return str.split(" ").slice(0, 3).flatMap(v => v.slice(0, 1).toUpperCase()).join("")
}

export const toHex = (num?: number) => {
    if (!num) num = DEFAULT_COLOR_NUM 
    return '#' + num.toString(16).padStart(6, '0');
};

export const getInitials = (name: string) => {
    const [firstName, lastName] = name.split(' ');
    if (firstName && lastName) {
        return `${firstName[0]}${lastName[0]}`;
    }
    return firstName[0]
}
