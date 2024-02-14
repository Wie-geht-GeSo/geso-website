import type { TreeViewNode } from "@skeletonlabs/skeleton";

export interface NavigationPage {
    id: number;
    navigationTitle: string;
    manualSort: number;
    slug: string;
    icon: string;
    childPages?: NavigationPage[];
    parentPage?: NavigationPage;
    treeViewNode?: TreeViewNode
}