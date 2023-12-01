export interface NavigationPage {
    id: number;
    navigationTitle: string;
    slug: string;
    icon: string;
    childPages?: NavigationPage[];
    parentPage?: NavigationPage;
}