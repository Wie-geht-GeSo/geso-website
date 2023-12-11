import type { AccordionBlock } from "./AccordionBlock";
import type { CardGroupBlock } from "./CardGroupBlock";
import type { ContentBlock } from "./ContentBlock";
import type { LinkBlock } from "./LinkBlock";
import type { LinkGroupBlock } from "./LinkGroupBlock";

interface BaseBlock {
    id: number;
    sort: number;
}

interface BaseCardGroupBlock extends BaseBlock {
    collection: "blockCardGroup";
    item: CardGroupBlock; 
}

interface BaseContentBlock extends BaseBlock {
    collection: "blockContent";
    item: ContentBlock; 
}

interface BaseLinkGroupBlock extends BaseBlock {
    collection: "blockLinkGroup";
    item: LinkGroupBlock; 
}

interface BaseLinkBlock extends BaseBlock {
    collection: "blockLink";
    item: LinkBlock; 
}

interface BaseAccordionBlock extends BaseBlock {
    collection: "blockAccordion";
    item: AccordionBlock; 
}

// Add more block type interfaces as needed

// Union type for blocks
export type Block = BaseCardGroupBlock | BaseContentBlock | BaseLinkGroupBlock | BaseLinkBlock | BaseAccordionBlock   /* | OtherBlockTypes */;