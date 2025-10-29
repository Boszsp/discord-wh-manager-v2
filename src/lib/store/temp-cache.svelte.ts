import { get, writable } from 'svelte/store';

export const userTempCacheStore = writable<Map<string,any>>(new Map());

export function saveTempCache(key:string,val:object){
    userTempCacheStore.update(
        m=>m.set(key,val)
    )
}

export function loadTempCache(key:string){
    return get(userTempCacheStore).get(key)
}
export function updateTempCache(key:string,val:object){
    let tempVal = loadTempCache(key);
    if (tempVal instanceof Array){
        tempVal.push(val);
    } else if((typeof tempVal) === "object"){
        tempVal = Object.assign(tempVal,val)
    }
    userTempCacheStore.update(
        m => m.set(key, tempVal)
    )
}

export function clearTempCache(key:string){
    userTempCacheStore.update(
        m => {
            m.delete(key)
            return m
        }
    )
}

export function clearAllTempCache(){
    userTempCacheStore.set(new Map()) 
}