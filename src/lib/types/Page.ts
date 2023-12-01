import type { Block } from "./blocks/Block";

export interface Page {
    id: number;
	title: string;
    navigationTitle: string;
    slug: string;
    blocks: Block[];
    icon: string;
    childPages?: Page[];
    parentPage?: Page;
}
