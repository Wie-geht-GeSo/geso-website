import type { UUID } from "crypto";
import type { Page } from "../Page";

export interface CardGroupBlock {
    cardGroup: CardGroup;
}

export interface CardGroup {
    id: number;
    title: string;
    cards: CardJunction[];
}

export interface CardJunction {
    card: Card;
}

export interface Card {
    id: number;
    title: string;
    subTitle: string;
    textContent: string;
    image: UUID; 
    imageSrc: string; // Built by pageService based on UUID
    page: Page;
}