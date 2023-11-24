import type { LayoutServerLoad } from './$types';
import { directusRest } from '$lib/cms/directus';
import type { Header } from '$lib/types/Header';
import { readItems, readSingleton } from '@directus/sdk';
import type { Page } from '$lib/types/Page';
import { error } from '@sveltejs/kit';

export const load = (async () => {
    try {
        // TODO: Better error handling
        const header = await directusRest.request<Header>(readSingleton('header'));
        const pages = await directusRest.request<Page[]>(
            readItems('pages', {
                fields: [
                    '*'
                ],
            })
        );


        return { header, navigationPages: pages };

    } catch (e) {
        throw error(500, 'Internal Server Error');
    }
    
}) satisfies LayoutServerLoad;