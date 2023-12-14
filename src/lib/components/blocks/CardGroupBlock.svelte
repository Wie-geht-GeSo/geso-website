<script lang="ts">
	import type { CardGroupBlock } from '$lib/types/blocks/CardGroupBlock';

	export let data: CardGroupBlock;
</script>

{#if data.title}
	<p class="h3">{data.title}</p>
{/if}
<div
	class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 py-5"
>
	{#each data.cards as card}
		<!-- TODO: Error handling for missing page -->
		<a href={card.page.slug} class="card p-4 text-center bg-initial card-hover overflow-hidden">
			<header class="card-header">
				<span class="material-symbols-rounded text-6xl">{card.page.icon} </span>
			</header>
			<footer class="card-footer">
				{card.title}
				<footer />
			</footer>
		</a>
	{/each}
</div>
