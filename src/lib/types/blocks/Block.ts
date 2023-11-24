import type { CardGroupBlock } from "./CardGroupBlock";
import type { ContentBlock } from "./ContentBlock";

interface BaseBlock {
    id: number;
    pages_id: string;
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

// Add more block type interfaces as needed

// Union type for blocks
export type Block = BaseCardGroupBlock | BaseContentBlock /* | OtherBlockTypes */;