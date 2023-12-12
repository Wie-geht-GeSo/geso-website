import { directusRest } from "$lib/cms/directus";
import type { Page } from "$lib/types/Page";
import { readItem, readItems, updateItem } from "@directus/sdk";
import { error } from "@sveltejs/kit";
import { injectDataIntoContent } from "directus-extension-flexible-editor/content";
import { serializers } from "directus-extension-flexible-editor/content";

export async function getPageBySlug(slug: string): Promise<Page> {
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
        throw error(404, { message: 'Page with slug ' + slug + ' not found' });
    }
}

async function ratePage(pageId: number, action: "like" | "dislike", previouslyOpposite: boolean): Promise<void> {
    const page = await directusRest.request<Page>(
        readItem('pages', pageId, {
            fields: ['likes', 'dislikes'],
        })
    );

    if (page) {
        const updatedLikes = action === 'like' ? page.likes + 1 : (previouslyOpposite ? page.likes - 1 : page.likes);
        const updatedDislikes = action === 'dislike' ? page.dislikes + 1 : (previouslyOpposite ? page.dislikes - 1 : page.dislikes);
        await directusRest.request(
            updateItem('pages', pageId, { likes: updatedLikes, dislikes: updatedDislikes })
        );
    } else {
        throw error(404, 'Page with id ' + pageId + ' not found');
    }
}

export async function likePage(pageId: number, previouslyDisliked: boolean): Promise<void> {
    await ratePage(pageId, 'like', previouslyDisliked);
}

export async function dislikePage(pageId: number, previouslyLiked: boolean): Promise<void> {
    await ratePage(pageId, 'dislike', previouslyLiked);
}

