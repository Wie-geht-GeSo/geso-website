import type { Header } from '$lib/types/Header';
import { createDirectus, graphql, readSingleton, rest } from '@directus/sdk';
import { DIRECTUS_URL } from '$env/static/private';
import type { Page } from '$lib/types/Page';
import type { Menu } from '$lib/types/menu/Menu';
import type { Globals } from '$lib/types/Globals';
import type { Footer } from '$lib/types/Footer';


interface Schema {
    globals: Globals;
    menu: Menu;
    header: Header;
    footer: Footer;
    pages: Page[];
    page: Page;
}


if (!DIRECTUS_URL) {
    throw new Error('Directus URL is not defined');
}

export const directusGraphQL = createDirectus<Schema>(DIRECTUS_URL).with(graphql());
export const directusRest = createDirectus<Schema>(DIRECTUS_URL).with(rest());