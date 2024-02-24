import { json } from "@sveltejs/kit";
import { WEAVIATE_HOST } from "$env/static/private";
import {WEAVIATE_SCHEME} from "$env/static/private";
import weaviate, { type WeaviateClient, ObjectsBatcher, ApiKey, FusionType } from 'weaviate-ts-client';

const client: WeaviateClient = weaviate.client({
    scheme: WEAVIATE_SCHEME,
    host: WEAVIATE_HOST,
});

interface SearchPage {
    title: string;
    slug: string;
}

export async function GET({ url }) {
    const query = url.searchParams.get('query');
    if (!query) {
        return json([]);
    }

    const searchResult = await client.graphql
        .get()
        .withClassName('Page')
        .withFields(`slug title aiContent _additional {score explainScore distance rerank(property: "aiContent" query: "${query}") { score } }`)
        .withHybrid({ query: query, fusionType: FusionType.relativeScoreFusion }) // TODO: Adapt alpha
        .withAutocut(2) // Autocut to only return the top results TODO: Experiment with this
        .do();

    const parsedResult: SearchPage[] = searchResult.data.Get.Page.map((page: SearchPage) => ({
        title: page.title,
        slug: page.slug,
    }));

    return json(parsedResult);
}
