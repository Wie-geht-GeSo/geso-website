import type { TreeViewNode } from "@skeletonlabs/skeleton";

export interface NavigationPage {
    id: number;
    navigationTitle: string;
    slug: string;
    icon: string;
    childPages?: NavigationPage[];
    parentPage?: NavigationPage;
    treeViewNode?: TreeViewNode
}