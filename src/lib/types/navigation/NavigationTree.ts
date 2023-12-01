import type { MenuItem } from "./MenuItem";

export interface NavigationTree {
    root: MenuItem[];
    current: MenuItem[];
}