import { get, writable } from 'svelte/store';
import { browser } from '$app/environment';

const LOCAL_STORAGE_KEY = 'localStorageCache';

function getInitialValue(): Map<string, any> {
    if (!browser) {
        return new Map();
    }

    const storedValue = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedValue) {
        try {
            const parsed = JSON.parse(storedValue);
            if (Array.isArray(parsed)) {
                return new Map(parsed);
            }
        } catch (e) {
            console.error("Failed to parse localStorage cache", e);
        }
    }
    return new Map();
}

const localStorageCacheStore = writable<Map<string, any>>(getInitialValue());

function persistToLocalStorage() {
    if (browser) {
        const value = get(localStorageCacheStore);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(Array.from(value.entries())));
    }
}

export function saveToLocalStorage(key: string, val: any) {
    localStorageCacheStore.update(m => m.set(key, val));
    persistToLocalStorage();
}

export function loadFromLocalStorage(key: string): any {
    return get(localStorageCacheStore).get(key);
}

export function updateInLocalStorage(key: string, val?: object, oldId?: string) {
    let tempVal = loadFromLocalStorage(key);
    if (Array.isArray(tempVal)) {
        if (oldId) {
            tempVal = tempVal.filter((v: any) => v.id !== oldId);
        }
        if (val) {
            tempVal.push(val);
        }
    } else if (typeof tempVal === 'object' && tempVal !== null) {
        if (val) {
            tempVal = Object.assign(tempVal, val);
        }
    } else if (val !== undefined) {
        tempVal = val;
    }

    localStorageCacheStore.update(m => m.set(key, tempVal));
    persistToLocalStorage();
}

export function clearFromLocalStorage(key: string) {
    localStorageCacheStore.update(m => {
        m.delete(key);
        return m;
    });
    persistToLocalStorage();
}

export function clearAllLocalStorage() {
    localStorageCacheStore.set(new Map());
    if (browser) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
}
