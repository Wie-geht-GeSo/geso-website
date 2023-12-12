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
    return root;
}


export async function fetchAllNavigationPages(): Promise<NavigationPage[]> {
    const pages = await directusRest.request<NavigationPage[]>(
        readItems('pages', {
            filter: {
                "_or": [
                    { "slug": { "_eq": "home" } }, // Home page
                    { "parentPage": { "_nnull": true } } // All pages with a parent page
                ]
            },
            fields: ['id', 'slug', 'navigationTitle', 'icon', 'parentPage.id'],
        } as any)
    );
    return pages;
}

export async function getNavigationTreeRoot(): Promise<NavigationPage | undefined> {
    const navigationPages = await fetchAllNavigationPages();
    return buildNavigationTree(navigationPages);
}

