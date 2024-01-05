import type { Header } from '$lib/types/Header';
import { createDirectus, graphql, rest } from '@directus/sdk';
import { DIRECTUS_URL } from '$env/static/private';
import type { Globals } from '$lib/types/Globals';
import type { Footer } from '$lib/types/Footer';
import type { NavigationPage } from '../types/navigation/NavigationPage';
import type { Page } from '../types/Page';
import type { Feedback } from '$lib/types/Feedback';

interface Schema {
    globals: Globals;
    header: Header;
    footer: Footer;
    pages: Page[];
    page: Page;
    navigationPages: NavigationPage[];
    feedback: Feedback;
}


if (!DIRECTUS_URL) {
    throw new Error('Directus URL is not defined');
}

export const directusGraphQL = createDirectus<Schema>(DIRECTUS_URL).with(graphql());
export const directusRest = createDirectus<Schema>(DIRECTUS_URL).with(rest());