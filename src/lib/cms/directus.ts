import type { Header } from '$lib/types/Header';
import { createDirectus, graphql, rest } from '@directus/sdk';
import { DIRECTUS_URL } from '$env/static/private';
import type { Page } from '$lib/types/Page';


interface Schema {
	header: Header;
    pages: Page[];
    page: Page;
}


if (!DIRECTUS_URL) {
    throw new Error('Directus URL is not defined');
}

export const directusGraphQL = createDirectus<Schema>(DIRECTUS_URL).with(graphql());
export const directusRest = createDirectus<Schema>(DIRECTUS_URL).with(rest());