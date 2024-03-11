<script lang="ts">
	import type { PageData } from './$types';
	import {
		currentPageHasChildren,
		currentPageHasParent,
		currentSlug
	} from '$lib/stores/navigationStore';
	import { tocCrawler } from '@skeletonlabs/skeleton';
	import LinkBlock from '$lib/components/blocks/LinkBlock.svelte';
	import CardGroupBlock from '$lib/components/blocks/CardGroupBlock.svelte';
	import AccordionBlock from '$lib/components/blocks/AccordionBlock.svelte';
	import PopupBlock from '$lib/components/blocks/PopupBlock.svelte';
	import SmallTextBlock from '$lib/components/blocks/SmallTextBlock.svelte';
	import ImageBlock from '$lib/components/blocks/ImageBlock.svelte';
	import { page } from '$app/stores';
	import Rating from '$lib/components/Rating.svelte';
	import PageTitleHeader from '$lib/components/PageTitleHeader.svelte';
	import TableOfContents from '$lib/components/TableOfContents.svelte';

	export let data: PageData;
	// TODO: Move somewhere else
	// key: directus collection name, value: component
	const components: { [key: string]: any } = {
		link: LinkBlock,
		accordion: AccordionBlock,
		cardGroup: CardGroupBlock,
		popup: PopupBlock,
		smallText: SmallTextBlock,
		image: ImageBlock,
		// Add other block components as needed
	};
	let scrollToElement: HTMLElement;

	$: isContentPage = !$currentPageHasChildren && $currentPageHasParent; // TODO: Better way to check if page is content page
	$: widthClasses = isContentPage ? 'max-w-5xl w-full' : 'max-w-screen-xl w-full';
	const containerClasses = 'flex justify-center space-x-12';
</script>

{#if $page.error}
	<h1>{$page.error.message}</h1>
{/if}

<!-- Preload images -->
<svelte:head>
	{#each data.page.preloadImages as preloadImage}
		<link rel="preload" as="image" href={preloadImage} />
	{/each}
</svelte:head>

<section class="bg-surface-200-700-token {data.page.titleImage ? '' : 'py-10'}">
	<div class="{containerClasses} px-5 md:px-10">
		<div class="w-full {widthClasses} mx-auto">
			<PageTitleHeader
				{scrollToElement}
				title={data.page.title}
				subTitle={data.page.subTitle}
				titleImageSrc={data.page.titleImage ? data.page.titleImageSrc : null}
				altTitleImage={data.page.titleImage ? data.page.altTitleImage : ""}
			/>
		</div>
		<!-- Use invisible ToC to align title header correctly with content below -->
		{#if isContentPage}
			<TableOfContents className="invisible" />
		{/if}
	</div>
</section>

<div id="content" bind:this={scrollToElement} class="{containerClasses} px-5 md:px-10 py-10">
	<div
		use:tocCrawler={{ mode: 'generate', key: $currentSlug, scrollTarget: '#page' }}
		class="mx-auto space-y-4 {widthClasses}"
	>
		{#each data?.page?.transformedContent || [] as section}
			{#if section.type === 'html'}
				<div class="dynamic-html">{@html section.data}</div>
			{:else}
				<!-- Dynamically render component -->
				<svelte:component this={components[section.type]} data={section.data} />
			{/if}
		{/each}

		{#if isContentPage}
			<Rating page={data.page} />
		{/if}
	</div>

	{#if isContentPage}
		<TableOfContents />
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
