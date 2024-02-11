export interface AccordionBlock {
    accordion: Accordion;
}

export interface Accordion {
    id: number;
    items: AccordionItem[];
}

export interface AccordionItem {
    id: number;
    title: string;
    icon: string;
    content: string;
}