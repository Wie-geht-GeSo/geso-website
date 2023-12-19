import { directusRest } from "$lib/services/directusService";
import type { Page } from "$lib/types/Page";
import { readItem, readItems, updateItem } from "@directus/sdk";
import { error } from "@sveltejs/kit";
import { DIRECTUS_URL } from '$env/static/private';
import type { CardBlock, CardBlockJunction } from "$lib/types/blocks/CardGroupBlock";


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
                //// CardBlock (Junction table)
                'editorNodes.item.cards.card.*',
                'editorNodes.item.cards.card.page.slug',
                'editorNodes.item.cards.card.page.icon',
                // AccordionBlock
                'editorNodes.item.items.*',
            ] as any,
            limit: 1,
        })
    );
    if (pages.length > 0) {
        const page = pages[0];
        if (page.titleImage) {
            page.titleImageSrc = DIRECTUS_URL + '/assets/' + page.titleImage;
        }
        // Build the actual image source for all images in editorNodes -> DIRECTUS_URL + /assets/ + image
        page.editorNodes.forEach((editorNode) => {
            if (editorNode.item?.cards) {
                editorNode.item.cards.map((junction: CardBlockJunction) => junction.card)
                    .forEach((card: CardBlock) => {
                        if (card.image) {
                            card.imageSrc = DIRECTUS_URL + '/assets/' + card.image;
                        }
                    });
            }
        });


        return page;
    } else {
        error(404, { message: 'Page with slug ' + slug + ' not found' });
    }
}

async function ratePage(pageId: number, action: "like" | "dislike", previouslyOpposite: boolean): Promise<void> {
    // Get the current likes and dislikes
    const page = await directusRest.request<Page>(
        readItem('pages', pageId, {
            fields: ['likes', 'dislikes'],
        })
    );

    if (page) {
        // If the user previously disliked the page and now likes it, or vice versa, we need to also decrement the opposite rating
        const updatedLikes = action === 'like' ? page.likes + 1 : (previouslyOpposite ? page.likes - 1 : page.likes);
        const updatedDislikes = action === 'dislike' ? page.dislikes + 1 : (previouslyOpposite ? page.dislikes - 1 : page.dislikes);
        await directusRest.request(
            updateItem('pages', pageId, { likes: updatedLikes, dislikes: updatedDislikes })
        );
    } else {
        error(404, 'Page with id ' + pageId + ' not found');
    }
}

export async function likePage(pageId: number, previouslyDisliked: boolean): Promise<void> {
    await ratePage(pageId, 'like', previouslyDisliked);
}

export async function dislikePage(pageId: number, previouslyLiked: boolean): Promise<void> {
    await ratePage(pageId, 'dislike', previouslyLiked);
}

