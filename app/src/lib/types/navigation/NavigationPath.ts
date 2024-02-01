import type { NavigationPage } from "./NavigationPage";

export interface NavigationPath {
    page: NavigationPage; // The page that is at the end of the path
    parent: NavigationPage | null; // The parent of the page
    slugsPath: string[]; // All the slugs in the path until the root page
}