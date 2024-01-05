import { getModalStore, type ModalSettings, type ModalStore } from "@skeletonlabs/skeleton";

export function isStandalonePage(slug: string): boolean {
    if (slug === 'home') return true;
    if (slug === 'about') return true;
    if (slug === 'faq') return true ;  
    if (slug === 'kontakt') return true ;  
    if (slug === 'impressum') return true;
    if (slug === 'datenschutzerklaerung') return true;
    return false;
}

export async function triggerContactModal(modalStore: ModalStore): Promise<void> {
    new Promise<boolean>((resolve) => {
        const modal: ModalSettings = {
            type: 'component',
            component: 'modalContactForm'
        };
        modal.response = (formResponse: boolean) => {
            if (formResponse) resolve(formResponse);
        };
        modalStore.trigger(modal);
    }).then(async (formResponse: any) => {
        await fetch('/api/contact', {
            method: 'POST',
            body: JSON.stringify(formResponse),
            headers: {
                'content-type': 'application/json'
            }
        });
    });
}