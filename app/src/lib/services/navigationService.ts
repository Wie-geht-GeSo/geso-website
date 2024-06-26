import { directusRest } from '$lib/services/directusService';
import type { NavigationPage } from '$lib/types/navigation/NavigationPage';
import { readItems } from '@directus/sdk';

async function buildNavigationTree(navigationPages: NavigationPage[]): Promise<NavigationPage | undefined> {
    const lookup = new Map<number, NavigationPage>();
    navigationPages.forEach(page => lookup.set(page.id, { ...page, childPages: [] }));

    let root: NavigationPage | undefined;

    navigationPages.forEach(page => {
        if (page.parentPage) {
            const parent = lookup.get(page.parentPage.id);
            parent?.childPages?.push(lookup.get(page.id)!);
        } else {
            root = lookup.get(page.id);
        }
    });

    // Sort the children of each node based on the manualSort property
    const sortChildren = (node: NavigationPage) => {
        node.childPages?.sort((a, b) => a.manualSort - b.manualSort);
        node.childPages?.forEach(sortChildren);
    };

    // Now sort the entire tree in one go.
    if (root) {
        sortChildren(root);
    }

    return root;
}


export async function fetchAllNavigationPages(): Promise<NavigationPage[]> {
    try {
        const pages = await directusRest.request<NavigationPage[]>(
            readItems('pages', {
                filter: {
                    "_or": [
                        { "slug": { "_eq": "home" } }, // Home page
                        { "parentPage": { "_nnull": true } } // All pages with a parent page
                    ]
                },
                fields: ['id', 'slug', 'navigationTitle', 'manualSort', 'icon', 'parentPage.id'],
            } as any)
        );
        return pages;
    } catch (e) {
        console.error('Error fetching navigation pages:', e);
    }
    return [];
}

export async function getNavigationTreeRoot(): Promise<NavigationPage | undefined> {
    const navigationPages = await fetchAllNavigationPages();
    return buildNavigationTree(navigationPages);
}

