import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getPageBySlug } from '$lib/services/pageService';


export const load: PageServerLoad = async ({ url }) => {
    if (url.pathname === '/') {
        throw redirect(301, '/home');
    }

    // TODO: Use store?
    const currentSlug = url.pathname.split('/').pop() || 'home';
    const page = await getPageBySlug(currentSlug);
    return { page };
};

