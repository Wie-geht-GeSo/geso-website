import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { readItems } from '@directus/sdk';
import { directusRest } from '$lib/cms/directus';
import type { Page } from '$lib/types/Page';

export const load: PageServerLoad = async ({ params }) => {
    let slug;

    if (params.slug) {
        const slugArray = params.slug.split('/');
        slug = slugArray[slugArray.length - 1];
    } else {
        // Default slug when no slug is present (root path)
        slug = 'home';
    }


    try {
        const pages = await directusRest.request<Page[]>(
            readItems('pages', {
                filter: {
                    slug: { _eq: slug },
                },
                fields: [
                    '*',
                    'blocks.*',
                    'blocks.item.*',
                    'blocks.item.cards.*', 
                    'blocks.item.cards.page.slug',
                    'blocks.item.cards.page.icon',
                ],
                limit: 1,
            })
        );

        if (pages.length > 0) {
            const page: Page = pages[0];
            return { page };
        } else {
            throw error(404, 'Not found');
        }
    } catch (e) {
        throw error(500, 'Internal Server Error');
    }
};
