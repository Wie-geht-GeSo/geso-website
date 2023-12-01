import type { LayoutServerLoad } from './$types';
import { directusRest } from '$lib/directus';
import type { Header } from '$lib/types/Header';
import { readItems, readSingleton } from '@directus/sdk';
import { error } from '@sveltejs/kit';
import { DIRECTUS_URL } from '$env/static/private';
import type { Globals } from '$lib/types/Globals';
import type { Footer } from '$lib/types/Footer';
import { buildNavigationTree } from '$lib/navigation';
import type { NavigationPage } from '$lib/types/navigation/NavigationPage';

async function fetchAllNavigationPages(): Promise<NavigationPage[]> {
    const pages = await directusRest.request<NavigationPage[]>(
        readItems('pages', {
            filter: {
                "_or": [
                    { "slug": { "_eq": "home" } }, // Home page
                    { "parentPage": { "_nnull": true } } // All pages with a parent page
                ]
            },
            fields: ['id', 'slug', 'navigationTitle', 'icon', 'parentPage.id'],
        })
    );
    return pages;
}



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

        const navigationPages = await fetchAllNavigationPages();
        const navigationTree = await buildNavigationTree(navigationPages);
        const logoLightModePath = DIRECTUS_URL + '/assets/' + globals.logoLightMode;
        const logoDarkModePath = DIRECTUS_URL + '/assets/' + globals.logoDarkMode;
        globals.logoLightModePath = logoLightModePath;
        globals.logoDarkModePath = logoDarkModePath;


        return { globals, navigationTree, header, footer };

    } catch (e) {
        console.error('layout.server.ts: ', e);
        throw error(500, "Internal Server Error");
    }

}) satisfies LayoutServerLoad;