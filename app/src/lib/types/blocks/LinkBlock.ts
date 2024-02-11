import type { Page } from "../Page";

export interface LinkBlock {
    link: Link;
}

export interface Link {
    id: number;
    name: string;
    url?: string;
    page?: Page;
    contactForm?: boolean;
}