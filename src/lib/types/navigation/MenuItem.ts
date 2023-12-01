import type { SubMenu } from "./SubMenu";

export interface MenuItem {
    title: string;
    slug: string;
    icon: string;
    subMenu?: SubMenu;
}