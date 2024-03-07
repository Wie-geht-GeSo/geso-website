import { directusRest } from "$lib/services/directusService";
import type { Page } from "$lib/types/Page";
import { createItem, readItem, readItems, updateItem } from "@directus/sdk";
import { error } from "@sveltejs/kit";
import { DIRECTUS_URL } from '$env/static/private';
import type { Card, CardJunction } from "$lib/types/blocks/CardGroupBlock";
import type { Feedback } from "$lib/types/Feedback";
import { randomUUID } from "crypto";


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
                    'childPages.titleImage',
                    // LinkBlock
                    'editorNodes.item.link.*',
                    'editorNodes.item.link.page.slug',
                    'editorNodes.item.link.page.icon',
                    // CardGroupBlock
                    'editorNodes.item.cardGroup.cards.title',
                    //// CardBlock (Junction table)
                    'editorNodes.item.cardGroup.cards.card.*',
                    'editorNodes.item.cardGroup.cards.card.page.slug',
                    'editorNodes.item.cardGroup.cards.card.page.icon',
                    // AccordionBlock
                    'editorNodes.item.accordion.items.*',
                    // PopupBlock
                    'editorNodes.item.popup.*',
                    // SmallTextBlock
                    'editorNodes.item.smallText.*',
                    // ImageBlock
                    'editorNodes.item.image.*',
                ] as any,
                limit: 1,
            })
        );

        if (pages.length > 0) {
            const page = pages[0];
            function buildImageSrc(image: string): string {
                return `${DIRECTUS_URL}/assets/${image}`;
            }

            /* Build the actual image sources and preload them */
            page.preloadImages = [];
            if (page.titleImage) {
                page.titleImageSrc = buildImageSrc(page.titleImage);
                page.preloadImages.push(page.titleImageSrc);
            }

            // EditorNodes Image
            page.editorNodes?.forEach((editorNode) => {
                // Cards
                if (editorNode.item?.cardGroup?.cards) {
                    editorNode.item.cardGroup.cards.forEach((junction: CardJunction) => {
                        if (junction.card && junction.card.image) {
                            junction.card.imageSrc = buildImageSrc(junction.card.image);
                            page.preloadImages.push(junction.card.imageSrc);
                        }
                    });
                }
                // Content Image
                if (editorNode.item?.image?.image) {
                    editorNode.item.image.imageSrc = buildImageSrc(editorNode.item.image.image);
                    page.preloadImages.push(editorNode.item.image.imageSrc);
                }
            });

            // Title image of first child pages for potential next navigation
            // Note: This leads to better usability but potentially unnecessary image preloading
            if (page.childPages) {
                page.childPages.forEach((childPage) => {
                    if (childPage.titleImage) page.preloadImages.push(buildImageSrc(childPage.titleImage));
                });
            }

            return page;
        } else {
            error(404, { message: `Page with slug ${slug} not found` });
        }
    } catch (e) {
        console.error('Failed to get page by slug:', e);
    }


    // Return an error Page
    return {
        id: -1,
        title: 'Error',
        subTitle: 'Diese Seite konnte nicht gefunden werden.',
        titleImage: randomUUID(),
        preloadImages: [],
        titleImageSrc: 'https://images.unsplash.com/photo-1529927066849-79b791a69825?q=80&w=3869&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        navigationTitle: '',
        slug: '',
        blocks: [],
        icon: '',
        editorNodes: [],
        likes: 0,
        dislikes: 0,
    };

}

export async function getPagesForSearch(): Promise<Page[]> {
    try {
        const pages = await directusRest.request<Page[]>(
            readItems('pages', {
                fields: ['id', 'title', 'slug', 'aiContent'],
            })
        );

        return pages;
    } catch (e) {
        console.error('Failed to get pages for search:', e);
        return [];
    }
}

async function ratePage(pageId: number, action: "like" | "dislike", previouslyOpposite: boolean): Promise<void> {
    try {
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
            console.error('Page with id ' + pageId + ' not found')
        }
    } catch (e) {
        console.error('Failed to rate page:', e);
    }
}

export async function likePage(pageId: number, previouslyDisliked: boolean): Promise<void> {
    await ratePage(pageId, 'like', previouslyDisliked);
}

export async function dislikePage(pageId: number, previouslyLiked: boolean): Promise<void> {
    await ratePage(pageId, 'dislike', previouslyLiked);
}

export async function submitContactForm(feedback: Feedback): Promise<void> {
    try {
        await directusRest.request(createItem('feedback', feedback));
    } catch (e) {
        console.error('Failed to submit contact form:', e);
    }
}

