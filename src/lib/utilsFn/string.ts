export function convertToFallbackString(str: string){
    return str.split(" ").slice(0,3).flatMap(v=>v.slice(0,1).toUpperCase()).join("")
}