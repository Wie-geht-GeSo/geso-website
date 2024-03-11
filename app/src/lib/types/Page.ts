import type { TransformedContentSection } from "$lib/services/contentTransformationService";
import type { UUID } from "crypto";
import type { Block } from "./blocks/Block";
import type { JSONContent } from "@tiptap/core";

export interface Page {
    id: number;
	title: string;
    subTitle: string;
    titleImage: UUID;
    altTitleImage: string;
    titleImageSrc: string;  // Fetched by pageService based on UUID
    preloadImages: string[];
    navigationTitle: string;
    slug: string;
    blocks: Block[];
    icon: string;
    content?: JSONContent; // Only used in the cms editor
    aiContent?: string; // Content for the AI search
    transformedContent?: TransformedContentSection[]; // HTML and components for rendering
    editorNodes: any[];   
    childPages?: Page[];
    parentPage?: Page;
    likes: number;
    dislikes: number;
}
