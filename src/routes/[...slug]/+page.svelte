<script lang="ts">
	import type { PageData } from './$types';
	import {
		currentPageHasChildren,
		currentPageHasParent,
		currentSlug
	} from '$lib/stores/navigationStore';
	import { TableOfContents, tocCrawler } from '@skeletonlabs/skeleton';
	import LinkBlock from '$lib/components/blocks/LinkBlock.svelte';
	import CardGroupBlock from '$lib/components/blocks/CardGroupBlock.svelte';
	import AccordionBlock from '$lib/components/blocks/AccordionBlock.svelte';
	import PopupBlock from '$lib/components/blocks/PopupBlock.svelte';
	import SmallTextBlock from '$lib/components/blocks/SmallTextBlock.svelte';
	import { page } from '$app/stores';
	import Rating from '$lib/components/Rating.svelte';
	import PageTitleHeader from '$lib/components/PageTitleHeader.svelte';

	export let data: PageData;
	// TODO: Move somewhere else
	// key: directus collection name, value: component
	const components: { [key: string]: any } = {
		blockLink: LinkBlock,
		blockAccordion: AccordionBlock,
		blockCardGroup: CardGroupBlock,
		blockPopup: PopupBlock,
		blockSmallText: SmallTextBlock
		// Add other block components as needed
	};
	let scrollToElement: HTMLElement;

	$: isContentPage = !$currentPageHasChildren && $currentPageHasParent; // TODO: Better way to check if page is content page

</script>

{#if $page.error}
	<h1>{$page.error.message}</h1>
{/if}

<!-- Preload images -->
<svelte:head>
	<link rel="preload" as="image" href={data.page.titleImageSrc} />
	{#each data.page.editorNodes as editorNode}
		{#if editorNode.collection === 'blockCardGroup'}
			{#each editorNode.item.cards as {card} (card.id)}
				<link rel="preload" as="image" href={card.imageSrc} />
			{/each}
		{/if}
	{/each}
</svelte:head>

<section class="bg-surface-200-700-token {data.page.titleImage ? '' : 'py-10'}">
	<PageTitleHeader
		scrollToElement={scrollToElement}
		title={data.page.title}
		subTitle={data.page.subTitle}
		titleImageSrc={data.page.titleImage ? data.page.titleImageSrc : null}
	/>
</section>

<div bind:this={scrollToElement} class="flex items-start space-x-4">
	<div
		use:tocCrawler={{ mode: 'generate', key: $currentSlug, scrollTarget: '#page' }}
		class="container mx-auto flex flex-col py-10 px-5 sm:p-10 space-y-4 {!isContentPage
			? 'max-w-screen-xl'
			: 'max-w-5xl'}"
	>
		{#each data.page.transformedContent || [] as section}
			{#if section.type === 'html'}
				<div class="dynamic-html">{@html section.data}</div>
			{:else}
				<!-- Dynamically render component -->
				<svelte:component this={components[section.type]} data={section.data} />
			{/if}
		{/each}

		{#if isContentPage}
			<Rating page={data.page} />

			<!-- Start again button -->
			<div class="flex space-x-4 pt-10">
				<a href="/home" title="Neu beginnen" class="btn variant-glass-surface">
					<span class="material-symbols-outlined">restart_alt</span>
					<span>Von vorne beginnen</span>
				</a>
			</div>
		{/if}
	</div>

	{#if isContentPage}
		<TableOfContents class="hidden lg:grid w-1/4 sticky top-20 mt-20">
			<h1>Übersicht</h1>
		</TableOfContents>
	{/if}
</div>

<!-- Global styles for @html content -->
<style>
	:global(.dynamic-html h2) {
		@apply h2 py-5;
	}
	:global(.dynamic-html h3) {
		@apply h3 py-5;
	}
	:global(.dynamic-html a) {
		@apply anchor;
	}

	:global(.dynamic-html ul) {
		@apply list-disc ml-8 my-4;
	}

	:global(.dynamic-html ol) {
		@apply list-decimal ml-8 my-4;
	}

	:global(.dynamic-html li) {
		@apply py-2;
	}
</style>
