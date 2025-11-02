import { getCurUserPromise } from "$lib/db/auth";
import { db, type UserData } from "$lib/db/db.schema";
import { loadTempCache, saveTempCache, updateTempCache } from "$lib/store/temp-cache.svelte";
import { consola } from "consola";
import { nanoid } from "nanoid";

export async function getUserDataAction(): Promise<UserData | null> {
    const curUser = await getCurUserPromise();
    if (!curUser) throw new Error('User is not authenticated');
    const cache = loadTempCache(`user-data-${curUser.uid}`);
    if (cache) {
        consola.success('getUserDataAction Cache');
        return cache;
    }

    const udUId = db.ud.id(curUser?.uid);
    const ud = await db.ud.get(udUId)

    if (!ud) {
        consola.error('getUserDataAction: Template not found');
        return null;
    }
    const result = ud.data ;
    saveTempCache(`user-data-${curUser.uid}`, result);

    consola.success('getUserDataAction');
    return result;
}

export async function updateUserDataAction(data:Partial<UserData>): Promise<boolean> {
    const curUser = await getCurUserPromise();
    if (!curUser) throw new Error('User is not authenticated');
    

    const udUId = db.ud.id(curUser?.uid);
    const ud = await db.ud.upset(udUId,{ek:data.ek+"",er:nanoid(3)+""})

    if (!ud) {
        consola.error('updateUserDataAction: Template not found');
        return false;
    }
    updateTempCache(`user-data-${curUser.uid}`, data);

    consola.success('updateUserDataAction');
    return true;
}