import type { Page } from "../Page";

export interface CardGroupBlock {
    id: number;
    title: string;
    subTitle: string;
    content: string;
    cards: CardBlock[];
}

export interface CardBlock {
    id: number;
    title: string;
    subTitle: string;
    textContent: string;
    image: string; 
    page: Page;
}