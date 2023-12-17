import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { dislikePage, getPageBySlug, likePage } from '$lib/services/pageService';
import { transformPageContent } from '$lib/services/contentTransformationService';

export const load: PageServerLoad = async ({ url }) => {
    if (url.pathname === '/') {
        redirect(301, '/home');
    }

    // TODO: Use store?
    const currentSlug = url.pathname.split('/').pop() || 'home';
    const page = await getPageBySlug(currentSlug);
    transformPageContent(page); // Convert editor content to html and components
    return { page };
};


export const actions = {
    like: async ({ request }) => {
        const data = await request.formData();
        const pageId = Number(data.get('pageId'));
        const previousAction = data.get('previousAction')
        likePage(pageId, previousAction === 'true');
    },
    dislike: async ({ request }) => {
        const data = await request.formData();
        const pageId = Number(data.get('pageId'));
        const previousAction = data.get('previousAction')
        dislikePage(pageId, previousAction === 'true'); 
    },
};
