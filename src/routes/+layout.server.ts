import type { LayoutServerLoad } from './$types';
import { directus } from '$lib/cms/directus';
import type { Globals } from '$lib/models/Globals';
import { readSingleton } from '@directus/sdk';

export const load = (async () => {
    const globals = await directus.request<Globals>(readSingleton('globals'));

    console.log(globals);

    return { globals: globals };
}) satisfies LayoutServerLoad;