import { derived } from 'svelte/store';
import type { Readable } from 'svelte/store';
import { page } from '$app/stores';
import type { NavigationPage } from '$lib/types/navigation/NavigationPage';
import type { NavigationPath } from '../types/navigation/NavigationPath';


const currentSlug: Readable<string> = derived(page, $page =>
    $page.url.pathname.split('/').pop() || 'home'
);

const rootMenuItems: Readable<NavigationPage[]> = derived(page, $page => {
    const rootPage = $page.data.navigationTreeRoot as NavigationPage;
    console.log('rootPage: ', rootPage.childPages)
    return rootPage ? rootPage.childPages ?? [] : [];
});

const currentNavigationPath: Readable<NavigationPath | null> = derived(
    [page, currentSlug],
    ([$page, $currentSlug]) => {
        const rootPage = $page.data.navigationTreeRoot as NavigationPage;
        return rootPage ? traceNavigationPath(rootPage, $currentSlug) : null;
    }
);

const currentNavigationPathSlugs: Readable<string[]> = derived(currentNavigationPath, $currentNavigationPath =>
    $currentNavigationPath?.slugsPath ?? []
);


function traceNavigationPath(rootPage: NavigationPage, targetSlug: string): NavigationPath | null {
    function tracePath(
        currentNode: NavigationPage,
        slugsPath: string[] = [],
        parent: NavigationPage | null = null
    ): NavigationPath | null {
        if (currentNode.slug === targetSlug) {
            return { page: currentNode, parent, slugsPath: [...slugsPath, currentNode.slug] };
        }

        for (const child of currentNode.childPages ?? []) {
            const result = tracePath(child, [...slugsPath, currentNode.slug], currentNode);
            if (result) return result;
        }

        return null;
    }

    return tracePath(rootPage);
}

const currentPageHasChildren: Readable<boolean> = derived(
    currentNavigationPath,
    $currentNavigationPath => {
        if ($currentNavigationPath) {
            return Array.isArray($currentNavigationPath.page?.childPages) && 
                   $currentNavigationPath.page.childPages.length > 0;
        }
        return false;
    }
);

const currentPageHasParent: Readable<boolean> = derived(
    currentNavigationPath,
    $currentNavigationPath => {
        if ($currentNavigationPath) {
            return $currentNavigationPath.parent !== null;
        }
        return false;
    }
);

export {
    currentSlug,
    currentNavigationPath,
    currentNavigationPathSlugs,
    rootMenuItems,
    currentPageHasChildren,
    currentPageHasParent
};
