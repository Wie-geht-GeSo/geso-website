import type { Globals } from '$lib/models/Globals';
import { createDirectus, graphql, rest } from '@directus/sdk';
import { DIRECTUS_URL } from '$env/static/private';


interface Schema {
	globals: Globals;
}


if (!DIRECTUS_URL) {
    throw new Error('Directus URL is not defined');
}

export const directus = createDirectus<Schema>(DIRECTUS_URL).with(rest());