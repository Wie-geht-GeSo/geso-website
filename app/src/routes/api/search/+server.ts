import { getPagesForSearch } from "$lib/services/pageService.js";
import { json } from "@sveltejs/kit";
import OpenAI from "openai";
import { OPENAI_API_KEY } from "$env/static/private";

const aiClient = new OpenAI({ apiKey: OPENAI_API_KEY });
const systemPrompt = "You are a search assistant helping the user find pages on the austrian website. ONLY answer with a VALID json in the format [{\"title\": \"Title of the page\", \"slug\": \"slug-of-the-page\"}] containing one, multiple or no entries. If no page fits, respond with an empty json.";

export async function GET({ url }) {
    // TODO: Replace with vector search
    const allPages = await getPagesForSearch();
    const query = url.searchParams.get('query');

    const completion = await aiClient.chat.completions.create({
        messages: [{ "role": "system", "content": systemPrompt },
        { "role": "user", "content": systemPrompt + "Find all relevant or mostly relevant pages for this user input: <USER_INPUT_START>" + query + "<USER_INPUT_END> Search these pages and answer with the exact titles and slugs of the found pages in a COMPLETE and VALID json without code block." + JSON.stringify(allPages) },
        ],
        model: "gpt-4-0125-preview",
        // model: "gpt-3.5-turbo",
    });

    const response = completion.choices[0].message.content;
    if (!response) {
        return json([]);
    }
    let parsedResponse = extractJsonFromString(response);

    return json(parsedResponse);
}

function extractJsonFromString(str: string) {
    let jsonPart = str.match(/\{.*\}|\[.*\]/); // This regex attempts to match the JSON part
    if (jsonPart && jsonPart[0]) {
        try {
            return JSON.parse(jsonPart[0]);
        } catch (error) {
            console.error("Error parsing extracted JSON:", error);
            return [];
        }
    }
    return [];
}