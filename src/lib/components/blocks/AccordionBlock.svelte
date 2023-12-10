<script lang="ts">
    import type { AccordionBlock } from '$lib/types/blocks/AccordionBlock';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';

    export let accordionBlock: AccordionBlock;
</script>

<Accordion class="card">
    {#each accordionBlock.items as accordionItemBlock}
        <AccordionItem>
            <svelte:fragment slot="lead">
                <span class="material-symbols-outlined">{accordionItemBlock.icon}</span>
            </svelte:fragment>
            <svelte:fragment slot="summary">{accordionItemBlock.title}</svelte:fragment>
            <svelte:fragment slot="content">
                <div class="dynamic-html">{@html accordionItemBlock.content}<div/>
            </svelte:fragment>
        </AccordionItem>
    {/each}
</Accordion>
