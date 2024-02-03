import { json } from "@sveltejs/kit";


export async function GET({ url }) {
    // TODO: Implement actual search

    // Return placeholder results for now
    const placeholderResults = [
        {
            title: "Jugendcoaching",
            slug: "jugend-coaching",
        },
        {
            title: "Über GeSo",
            slug: "about",
        },
        {
            title: "Häufig gestellte Fragen",
            slug: "faq",
        },
    ];

    // Timeout for simulating for testing
    await new Promise((resolve) => setTimeout(resolve, 1000));


    return json(placeholderResults);

}
