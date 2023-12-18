<script lang="ts">
	import type { AccordionBlock } from '$lib/types/blocks/AccordionBlock';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';

	export let data: AccordionBlock;
</script>

<div class="py-3">
	<Accordion class="card" spacing="space-y-5" >
		{#each data.items as accordionItemBlock}
			<AccordionItem class="h-full">
				<svelte:fragment slot="lead">
					<span class="material-symbols-outlined">{accordionItemBlock.icon ? accordionItemBlock.icon : "question_mark"}</span>
				</svelte:fragment>
				<svelte:fragment slot="summary">{accordionItemBlock.title}</svelte:fragment>
				<svelte:fragment slot="content">
					<div class="dynamic-html">
						{@html accordionItemBlock.content}
					</div>
                    </svelte:fragment>
			</AccordionItem>
		{/each}
	</Accordion>
</div>
