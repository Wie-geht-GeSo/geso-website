import type { Page } from "../Page";
import type { LinkBlock } from "./LinkBlock";

export interface LinkGroupBlock {
    id: number;
    title: string;
    links: LinkBlock[];
}
