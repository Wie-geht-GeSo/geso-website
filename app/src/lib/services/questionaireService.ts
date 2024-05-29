import type { RequestQuestionnaire, RequestQuestion, Option} from '$lib/types/Questionnaire';
import { directusRest } from '$lib/services/directusService';
import { readItems } from '@directus/sdk';
import { error } from "@sveltejs/kit";

async function getItemById<T>(collection: string, id: number): Promise<T> {
    try {
        const items = await directusRest.request<T[]>(
            readItems(collection as any, {
                filter: {
                    id: { _eq: id },
                },
                fields: ['*'],
            })
        );
        if (items.length > 0) {
            return items[0];
        } else {
            error(404, { message: `${collection} with id ${id} not found` });
        }
    } catch (e) {
        console.error(`Error fetching ${collection} info:`, e);
    }
    return { id: -1 } as T;
}

export function getQuestionnaire(questionnaireId: number): Promise<RequestQuestionnaire>  {
    return getItemById<RequestQuestionnaire>('questionnaire', questionnaireId);
}

export function getQuestionnaireQuestion(questionId: number): Promise<RequestQuestion>  {
    return getItemById<RequestQuestion>('questionnaireQuestion', questionId);
}

export function getOption(optionId: number): Promise<Option> {
    return getItemById<Option>('questionnaireOption', optionId);
}