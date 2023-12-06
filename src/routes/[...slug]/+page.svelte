<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData ;
</script>

<div class="container mx-auto flex flex-col py-10 px-5 sm:p-10 space-y-4 sm:w-3/4">
	<h1 class="h1">{data.page.title}</h1>
	<hr />
	{#each data.page.blocks as block}
		{#if block.collection === 'blockCardGroup'}
			{#if block.item.title}
				<h2 class="h2">{block.item.title}</h2>
			{/if}
			<div
				class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
			>
				{#each block.item.cards as card}
					<!-- TODO: Error handling for missing page -->
					<a href={card.page.slug} class="card p-4 text-center">
						<header class="card-header">
							<span class="material-symbols-rounded text-6xl">{card.page.icon} </span>
						</header>
						<h3>{card.title}</h3>
					</a>
				{/each}
			</div>
		{:else if block.collection === 'blockContent'}
			<div class="blockContent">
				{#if block.item.title}
					<h2>{block.item.title}</h2>
				{/if}
				<p class="dynamic-html">{@html block.item.content}</p>
			</div>
		{/if}
	{/each}
</div>
