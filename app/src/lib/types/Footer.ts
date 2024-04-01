import type { Block } from "./blocks/Block";

export interface Footer {
    showLogo: boolean;
    showSlogan: boolean;
    showVersion: boolean;
    content: string;
    blocks: Block[];
}