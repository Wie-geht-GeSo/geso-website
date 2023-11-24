import type { UUID } from "crypto";
import type { Block } from "./blocks/Block";

export interface Page {
    id: UUID;
	title: string;
    slug: string;
    blocks: Block[];
    icon: string;
}
