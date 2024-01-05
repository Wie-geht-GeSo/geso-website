import { submitContactForm } from "$lib/services/pageService.js";
import type { Feedback } from "$lib/types/Feedback";
import { json } from "@sveltejs/kit";

export async function POST({ request }) {
    const feedback: Feedback = await request.json();
    submitContactForm(feedback);
    return json({ success: true });
}