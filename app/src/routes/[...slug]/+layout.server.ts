import type { LayoutServerLoad } from './$types';
import { directusRest } from '$lib/services/directusService';
import type { Header } from '$lib/types/Header';
import { readSingleton } from '@directus/sdk';
import { DIRECTUS_URL } from '$env/static/private';
import type { Globals } from '$lib/types/Globals';
import type { Footer } from '$lib/types/Footer';
import { getNavigationTreeRoot } from '$lib/services/navigationService';


export const load: LayoutServerLoad = (async () => {
    let globals, header, footer, navigationTreeRoot;

    try {
        globals = await directusRest.request<Globals>(readSingleton('globals'));
    } catch (e) {
        console.error('Error fetching globals: ', e);
    }

    try {
        header = await directusRest.request<Header>(readSingleton('header'));
    } catch (e) {
        console.error('Error fetching header: ', e);
    }

    try {
        footer = await directusRest.request<Footer>(readSingleton('footer', {
            fields: [
                '*',
                'blocks.*',
                'blocks.item.*',
                'blocks.item.links.*',
                'blocks.item.links.page.slug',
            ],
        }));
    } catch (e) {
        console.error('Error fetching footer: ', e);
    }

    if (globals) {
        const logoLightModePath = DIRECTUS_URL + '/assets/' + globals.logoLightMode;
        const logoDarkModePath = DIRECTUS_URL + '/assets/' + globals.logoDarkMode;
        globals.logoLightModePath = logoLightModePath;
        globals.logoDarkModePath = logoDarkModePath;
    }

    try {
        // Build the navigation root only once
        navigationTreeRoot = await getNavigationTreeRoot();
    } catch (e) {
        console.error('Error building navigation tree root: ', e);
    }

    return { globals, navigationTreeRoot, header, footer };
}) satisfies LayoutServerLoad;