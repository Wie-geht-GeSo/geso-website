import { directusRest } from "$lib/cms/directus";
import type { Page } from "$lib/types/Page";
import { readItems } from "@directus/sdk";
import { error } from "@sveltejs/kit";
import { injectDataIntoContent } from "directus-extension-flexible-editor/content";
import { serializers } from "directus-extension-flexible-editor/content";

export async function getPageBySlug(slug: string): Promise<Page> {
    try {
        const pages = await directusRest.request<Page[]>(
            readItems('pages', {
                filter: {
                    slug: { _eq: slug },
                },
                fields: [
                    // General
                    '*',
                    'editorNodes.*',
                    'editorNodes.item.*',
                    // LinkBlock
                    'editorNodes.item.page.slug',
                    'editorNodes.item.page.icon',
                    // CardGroupBlock
                    'editorNodes.item.cards.title',
                    'editorNodes.item.cards.page.slug',
                    'editorNodes.item.cards.page.icon',
                    // AccordionBlock
                    'editorNodes.item.items.*',
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