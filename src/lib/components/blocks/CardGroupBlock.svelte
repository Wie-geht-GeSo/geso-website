<script lang="ts">
	import type { CardGroupBlock } from '$lib/types/blocks/CardGroupBlock';
	import Error from '../error.svelte';

	export let data: CardGroupBlock;
</script>

{#if data && data.title}
	<p class="h3 text-center">{data.title}</p>
	<hr />
{/if}

{#if data && data.cards && data?.cards?.every((card) => card)}
	<div class="flex flex-wrap justify-center gap-10 pt-5">
		{#each data.cards as { card } (card?.id)}
			{#if card}
				<div
					class={`flex flex-col ${
						data.cards.length <= 3 ? ' sm:w-1/2 md:w-1/4' : 'sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5'
					} card text-center bg-surface-200-700-token card-hover overflow-hidden`}
				>
					<a href={card.page?.slug} class="flex flex-col h-full justify-between">
						<header>
							{#if card.image}
								<div class="overflow-hidden max-h-60">
									<img src={card.imageSrc} class="w-full object-cover object-top" alt="Post" />
								</div>
							{:else}
								<span class="material-symbols-outlined !text-4xl pt-6">{card.page.icon} </span>
							{/if}
						</header>
						<section class="py-4 px-1">
							<h1 class="h4 text-center">{card.title}</h1>
						</section>
					</a>
				</div>
			{/if}
		{/each}
	</div>
{:else}
	<Error />
{/if}
