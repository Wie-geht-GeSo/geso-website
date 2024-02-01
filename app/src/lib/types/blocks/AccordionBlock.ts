export interface AccordionBlock {
    id: number;
    items: AccordionItemBlock[];
}

export interface AccordionItemBlock {
    id: number;
    title: string;
    icon: string;
    content: string;
}