<script lang="ts">
	export let data;
</script>

<div class="container p-10 space-y-4">
	<h1>{data.page.title}</h1>
	<hr />
	{#each data.page.blocks as block}
		{#if block.collection === 'blockCardGroup'}
			<h2 class="h2">{block.item.title}</h2>
			<div
				class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
			>
				<!-- Render block_cardgroup -->
				{#each block.item.cards as card}
					<a href={card.page.slug} class="card p-4 text-center">
						<header class="card-header">
							<span class="material-icons text-6xl">{card.page.icon} </span>
						</header>
						<h3>{card.title}</h3>
					</a>
				{/each}
			</div>
		{:else if block.collection === 'blockContent'}
			<div class="blockContent">
				<h2>{block.item.title}</h2>
				<p class="html-content">{@html block.item.content}</p>
			</div>
		{/if}
	{/each}
</div>

<style>
	:global(.html-content a) {
	  color: blue; /* TODO: Use theme color */
	  text-decoration: underline;
	}
  </style>
