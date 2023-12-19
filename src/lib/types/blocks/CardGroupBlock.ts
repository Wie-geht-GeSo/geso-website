import type { Page } from "../Page";

export interface CardGroupBlock {
    id: number;
    title: string;
    subTitle: string;
    content: string;
    cards: CardBlockJunction[];
}

export interface CardBlockJunction {
    card: CardBlock;
}

export interface CardBlock {
    id: number;
    title: string;
    subTitle: string;
    textContent: string;
    image: string; // UUID of the image
    imageSrc: string; // Built by pageService
    page: Page;
}