import { directusRest } from '$lib/services/directusService';
import type { Globals } from '$lib/types/Globals';
import { readSingleton } from '@directus/sdk';

export async function getLayoutData() {
    let globals;
    try {
        globals = await directusRest.request<Globals>(readSingleton('globals'));
    } catch (e) {
        console.error('Error fetching globals: ', e);
    }
    return globals;
}