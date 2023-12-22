export function isStandalonePage(slug: string): boolean {
    if (slug === 'home') return true;
    if (slug === 'about') return true;
    if (slug === 'faq') return true;
    if (slug === 'impressum') return true;
    if (slug === 'datenschutzerklaerung') return true;
    return false;
}