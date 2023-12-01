import type { Page } from "../Page";

export interface LinkGroupBlock {
    id: number;
    title: string;
    links: LinkBlock[];
}

export interface LinkBlock {
    id: number;
    name: string;
    url: string;
    page: Page;
}