import type { Link } from "./Link";
import type { Block } from "./blocks/Block";

export interface Footer {
    showLogo: boolean;
    showSlogan: boolean;
    bottomLinks: Link[];
    blocks: Block[];
}