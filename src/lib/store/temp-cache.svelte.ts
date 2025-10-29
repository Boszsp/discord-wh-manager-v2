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