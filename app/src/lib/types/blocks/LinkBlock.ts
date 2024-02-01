import type { Page } from "../Page";

export interface LinkBlock {
    id: number;
    name: string;
    url?: string;
    page?: Page;
    contactForm?: boolean;
}