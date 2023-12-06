import { directusRest } from "$lib/cms/directus";
import type { Page } from "$lib/types/Page";
import { readItems } from "@directus/sdk";
import { error } from "@sveltejs/kit";

export async function getPageBySlug(slug: string): Promise<Page> {
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
                ] as any,
                limit: 1,
            })
        );
        if (pages.length > 0) {
            return pages[0];
        } else {
            throw error(404, 'Not found');
        }
    } catch (e) {
        throw error(500, 'Internal Server Error');
    }

}