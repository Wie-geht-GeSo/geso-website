import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { dislikePage, getPageBySlug, likePage } from '$lib/services/pageService';
import { transformPageContent } from '$lib/services/contentTransformationService';
import { getOption, getQuestionnaire, getQuestionnaireQuestion } from '$lib/services/questionaireService';
import { getLayoutData } from '$lib/services/globalsService';

export const load: PageServerLoad = async ({ url }) => {
    if (url.pathname === '/') {
        redirect(301, '/home');
    }

    const globals  = await getLayoutData();

    // TODO: Use store?
    const currentSlug = url.pathname.split('/').pop() || 'home';
    const page = await getPageBySlug(currentSlug);

    if (globals?.displayQuestionnaire && page.questionnaire){
        let questionnaire = await getQuestionnaire(page.questionnaire)
        page.questionnaireData = {
            id: questionnaire.id,
            questionnaireName: questionnaire.questionnaireName,
            questions: [],
        }

        for (let i = 0; i < questionnaire.questions.length; i++) {
            let question = await getQuestionnaireQuestion(questionnaire.questions[i]);
            if (question.questionType === 'multipleChoice' || question.questionType === 'singleChoice') {
                let options = [];
                for (let j = 0; j < question.options.length; j++) {
                    let option = await getOption(question.options[j]);
                    options.push(option);
                }
                page.questionnaireData.questions.push({
                    id: question.id,
                    question: question.question,
                    searchFormulation: question.searchFormulation,
                    questionType: question.questionType,
                    options: options,
                });
            } else {
                page.questionnaireData.questions.push({
                    id: question.id,
                    question: question.question,
                    searchFormulation: question.searchFormulation,
                    questionType: question.questionType,
                    options: [],
                });
            }
        }
    }

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
