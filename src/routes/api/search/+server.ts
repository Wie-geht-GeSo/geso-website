import { json } from "@sveltejs/kit";
import { WEAVIATE_HOST } from "$env/static/private";
import {WEAVIATE_SCHEME} from "$env/static/private";
import weaviate, { type WeaviateClient, ObjectsBatcher, ApiKey, FusionType } from 'weaviate-ts-client';
import fetch from 'node-fetch';

const client: WeaviateClient = weaviate.client({
    scheme: WEAVIATE_SCHEME,
    host: WEAVIATE_HOST,
    //   apiKey: new ApiKey('YOUR-WEAVIATE-API-KEY'),  // Replace w/ your Weaviate instance API key
    //   headers: { 'X-OpenAI-Api-Key': 'YOUR-OPENAI-API-KEY' },  // Replace with your inference API key
});

// response = (
//     client.query.get("Page", ["title", "aiContent", "slug"])
//     # .with_near_tex({"concepts": ["Jugendcoaching"]})
//     .with_hybrid(
//         query=query,
//         fusion_type=HybridFusion.RELATIVE_SCORE, # Needed for autocut with hybrid
//     )
//     # .with_limit(10)
//     .with_additional("score")
//     .with_additional('rerank(property: "aiContent" query: "' + query + '") { score }') # Cohere Reranker with same query
//     .with_autocut(1) # Autocut to only return the top results
//     .do()
// )




export async function GET({ url }) {
    const query = url.searchParams.get('query');
    if (!query) {
        return json([]);
    }

    const searchResult = await client.graphql
        .get()
        .withClassName('Page')
        .withFields('slug title aiContent _additional {score explainScore}')
        .withHybrid({ query: query, fusionType: FusionType.relativeScoreFusion })
        .withAutocut(1) // Autocut to only return the top results TODO: Experiment with this
        //   .withLimit(2)
        .do();

    console.log(JSON.stringify(searchResult, null, 2));

    // const completion = await aiClient.chat.completions.create({
    //     messages: [{ "role": "system", "content": systemPrompt },
    //     { "role": "user", "content": systemPrompt + "Find all relevant or mostly relevant pages for this user input: <USER_INPUT_START>" + query + "<USER_INPUT_END> Search these pages and answer with the exact titles and slugs of the found pages in a COMPLETE and VALID json without code block." + JSON.stringify(allPages) },
    //     ],
    //     model: "gpt-4-0125-preview",
    //     // model: "gpt-3.5-turbo",
    // });

    // const response = completion.choices[0].message.content;
    // if (!response) {
    //     return json([]);
    // }
    // let parsedResponse = extractJsonFromString(response);

    return json([]);
}
