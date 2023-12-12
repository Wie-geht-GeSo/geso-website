import type { LayoutServerLoad } from './$types';
import { directusRest } from '$lib/services/directusService';
import type { Header } from '$lib/types/Header';
import { readSingleton } from '@directus/sdk';
import { error } from '@sveltejs/kit';
import { DIRECTUS_URL } from '$env/static/private';
import type { Globals } from '$lib/types/Globals';
import type { Footer } from '$lib/types/Footer';
import { getNavigationTreeRoot } from '$lib/services/navigationService';


export const load: LayoutServerLoad = (async () => {
    // TODO: Better error handling
    try {
        const globals = await directusRest.request<Globals>(readSingleton('globals'));
        const header = await directusRest.request<Header>(readSingleton('header'));
        const footer = await directusRest.request<Footer>(readSingleton('footer', {
            fields: [
                '*',
                'bottomLinks.*',
                'blocks.*',
                'blocks.item.*',
                'blocks.item.links.*',
                'blocks.item.links.page.slug',
            ],
        }));

        const logoLightModePath = DIRECTUS_URL + '/assets/' + globals.logoLightMode;
        const logoDarkModePath = DIRECTUS_URL + '/assets/' + globals.logoDarkMode;
        globals.logoLightModePath = logoLightModePath;
        globals.logoDarkModePath = logoDarkModePath;

        // Build the navigation root only once
        const navigationTreeRoot = await getNavigationTreeRoot();
        return { globals, navigationTreeRoot, header, footer };

    } catch (e) {
        console.error('layout.server.ts: ', e);
        throw error(500, "Internal Server Error");
    }

}) satisfies LayoutServerLoad;