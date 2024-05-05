<script lang="ts">
	import { isStandalonePage } from '$lib/utils';
	import { currentSlug } from '$lib/stores/navigationStore';
	import { browser } from '$app/environment';
	import { isHomePage } from '$lib/stores/navigationStore';
	import { page } from '$app/stores';
	import Tags from './Tags.svelte';

	export let scrollToElement: HTMLElement;
	export let title: string;
	export let subTitle: string | null;
	export let tags: string[] | undefined;
	export let titleImageSrc: string | null;
	export let altTitleImage: string | null;
	export let captionTitleImage: string | null;

	function goBack() {
		history.back();
	}

	function scrollToContent() {
		if (browser && scrollToElement) {
			scrollToElement.scrollIntoView({ behavior: 'smooth' });
		}
	}

	let noBreadcrumbSlugs = ['home'];
	$: includeBreadcrumbs = !noBreadcrumbSlugs.includes($currentSlug);
</script>

<header
	class="flex items-center {isStandalonePage($currentSlug)
		? 'justify-evenly'
		: 'justify-between'} space-x-10 h-full"
>
	<div class="flex flex-col h-full my-10">
		{#if includeBreadcrumbs}
			<div class="flex items-start py-5">
				<ol class="breadcrumb">
					<li class="crumb">
						<a class="btn btn-sm hover:variant-soft-primary rounded-md" href="/home">
							<span class="material-symbols-outlined">home</span>
							<span>Startseite</span>
						</a>
					</li>
					<li class="crumb-separator" aria-hidden>|</li>
					<li class="crumb">
						<button class="btn btn-sm hover:variant-soft-primary rounded-md" on:click={goBack}>
							<span class="material-symbols-outlined">arrow_back</span>
							<span>Schritt zurück</span>
						</button>
					</li>
				</ol>
			</div>
		{/if}

		<div class="mt-auto mb-auto">
			<h1 class="h1 {$isHomePage ? 'font-bold' : ''}">
				<span class="title-gradient">{title}</span>
			</h1>
			{#if subTitle}
				<p class="h4 pt-3">{subTitle}</p>
			{/if}
			{#if tags}
				<Tags {tags} />
			{/if}
			{#if $isHomePage}
				<button
					class="btn variant-outline-secondary hover:variant-filled-secondary mt-10"
					on:click={scrollToContent}
				>
					<span>{$page?.data?.globals?.startButtonText || 'Zur Auswahl'}</span>
					<span class="material-symbols-outlined">expand_more</span>
				</button>
			{/if}
		</div>
	</div>

	{#if titleImageSrc}
		<div class="hidden sm:block self-center flex-shrink-0 relative">
			<img src={titleImageSrc} alt={altTitleImage} class="sm:h-56 lg:h-96 max-h-96 object-cover" />

			{#if captionTitleImage}
				<p
					class="captionTitleImage vertical-text absolute bottom-2 sm:bottom-2 right-0 sm:right-[-1.2rem] lg:right-[-1.5rem] translate-x-2 sm:translate-x-0 lg:translate-x-0 !text-sm opacity-60"
				>
					{captionTitleImage}
				</p>
			{/if}
		</div>
	{/if}
</header>

<style>
	.vertical-text {
		writing-mode: vertical-lr;
		white-space: nowrap;
		position: absolute;
		transform: rotate(180deg); /* Adjust translateX according to Tailwind's responsive classes */
	}
</style>
