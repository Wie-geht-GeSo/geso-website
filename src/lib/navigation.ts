import type { NavigationPage } from "./types/navigation/NavigationPage";
import type { NavigationPath } from "./types/navigation/NavigationPath";

export async function buildNavigationTree(navigationPages: NavigationPage[]): Promise<NavigationPage | undefined> {
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


export function traceNavigationPath(rootPage: NavigationPage, targetSlug: string): NavigationPath | null {
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