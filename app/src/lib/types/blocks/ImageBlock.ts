import type { UUID } from "crypto";

export interface ImageBlock {
    image: Image;
}

export interface Image {
    image: UUID;
    imageSrc: string; // Built by pageService based on UUID
    caption: string;
    alt: string;
}
