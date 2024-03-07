<script lang="ts">
	import type { AccordionBlock } from '$lib/types/blocks/AccordionBlock';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';

	export let data: AccordionBlock;
	$: accordion = data?.accordion;
</script>

{#if accordion && accordion.items}
	<div class="py-3">
		<Accordion class="card" spacing="space-y-5">
			{#each accordion.items as accordionItem}
				<AccordionItem class="h-full">
					<svelte:fragment slot="lead">
						<span class="material-symbols-outlined"
							>{accordionItem.icon ? accordionItem.icon : 'question_mark'}</span
						>
					</svelte:fragment>
					<svelte:fragment slot="summary">
						<span class="font-bold">
							{accordionItem.title}
						</span>
					</svelte:fragment>
					<svelte:fragment slot="content">
						<div class="dynamic-html">
							{@html accordionItem.content}
						</div>
					</svelte:fragment>
				</AccordionItem>
			{/each}
		</Accordion>
	</div>
{/if}
