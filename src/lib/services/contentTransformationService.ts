import { generateHTML } from '@tiptap/html';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Bold from '@tiptap/extension-bold';
import HardBreak from '@tiptap/extension-hard-break';
import Heading from '@tiptap/extension-heading';
import Italic from '@tiptap/extension-italic';
import Strike from '@tiptap/extension-strike';
import Underline from '@tiptap/extension-underline';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Blockquote from '@tiptap/extension-blockquote';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Code from '@tiptap/extension-code';
import CodeBlock from '@tiptap/extension-code-block';
import Table from '@tiptap/extension-table';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import TableRow from '@tiptap/extension-table-row';
// ...other extension imports as needed
import History from '@tiptap/extension-history';
import type { Page } from '$lib/types/Page';
import { injectDataIntoContent } from 'directus-extension-flexible-editor/content';

interface Section {
    type: string;
    content?: Section[];
    attrs?: any;
    text?: string;
    marks?: any[];
}

interface ContentBlock {
    type: string;
    content: Section[];
}

interface ComponentSection {
    type: string;
    attrs: {
        id: string;
        junction: string;
        collection: string;
        data: any;
    };
}

export interface TransformedContentSection {
    type: string;
    data?: any;
}


function convertSectionToHtml(section: Section[]) {
    return generateHTML(
        { type: 'doc', content: section },
        [
            Document, Paragraph, Text, Bold, HardBreak,
            Heading, Italic, Strike, Underline, BulletList,
            OrderedList, ListItem, Blockquote, HorizontalRule,
            Link, Image, Code, CodeBlock, Table, TableHeader,
            TableCell, TableRow, History
            // Add other extensions as needed
        ]
    );
}

function convertToComponent(section: ComponentSection): TransformedContentSection {
    return { type: section.attrs.collection, data: section.attrs.data };
}

function transformContent(content: ContentBlock): TransformedContentSection[] {
    const transformedSections: TransformedContentSection[] = [];
    let currentSection: Section[] = [];

    content.content.forEach((section: Section) => {
        if (section.type === 'relation-block') {
            const relationNode = section as ComponentSection;
            if (currentSection.length) {
                const html = convertSectionToHtml(currentSection);
                transformedSections.push({
                    type: 'html',
                    data: html
                });
                currentSection = [];
            }
            transformedSections.push(convertToComponent(relationNode));
        } else {
            currentSection.push(section);
        }
    });

    if (currentSection.length) {
        transformedSections.push({
            type: 'html',
            data: convertSectionToHtml(currentSection)
        });
    }

    return transformedSections;
}


export function transformPageContent(page: Page): void {
    if (page.content) {
        // Inject editor nodes into content directly
        // https://github.com/formfcw/directus-extension-flexible-editor
        injectDataIntoContent(page.editorNodes, page.content);
        // Add transformed editor content (html and components) to page
        const content = page.content as ContentBlock;
        page.transformedContent = transformContent(content);
    } else {
        // If page has no content, set transformedContent to an empty array
        page.transformedContent = [];
    }
}
