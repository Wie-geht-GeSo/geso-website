<script lang="ts">
	import type { CardGroupBlock } from '$lib/types/blocks/CardGroupBlock';

	export let data: CardGroupBlock;
</script>

{#if data.title}
	<p class="h3">{data.title}</p>
	<hr />
{/if}
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
	{#each data.cards as card}
    <a href={card.page.slug} class="card text-center bg-surface-100 card-hover overflow-hidden flex flex-col">
        <header class="flex-grow">
            {#if card.image}
            <div class="overflow-hidden max-h-60">
                <img src={card.imageSrc} class="w-full object-cover object-top" alt="Post" />
            </div>
            {:else}
                <span class="material-symbols-outlined !text-4xl pt-6">{card.page.icon} </span>
            {/if}
        </header>
        <section class="p-4">
            <h1 class="h4 text-center my-3">{card.title}</h1>
        </section>
    </a>
{/each}
</div>
