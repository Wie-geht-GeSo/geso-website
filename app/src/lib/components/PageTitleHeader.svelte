<script lang="ts">
	import { isStandalonePage } from '$lib/utils';
	import { currentSlug } from '$lib/stores/navigationStore';
	import { browser } from '$app/environment';
	import { isHomePage } from '$lib/stores/navigationStore';

	export let scrollToElement: HTMLElement;
	export let title: string;
	export let subTitle: string | null;
	export let titleImageSrc: string | null;
	export let altTitleImage: string | null;

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
						<a
							class="btn btn-sm hover:variant-soft-primary rounded-md"
							href="/home"
						>
							<span class="material-symbols-outlined">home</span>
							<span>Startseite</span>
					</a>
					</li>
					<li class="crumb-separator" aria-hidden>|</li>
					<li class="crumb">
						<button
							class="btn btn-sm hover:variant-soft-primary rounded-md"
							on:click={goBack}
						>
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
			{#if $isHomePage}
				<button
					class="btn variant-outline-primary hover:variant-filled-primary mt-10"
					on:click={scrollToContent}
				>
					<span>Start</span>
					<span class="material-symbols-outlined">expand_more</span>
				</button>
			{/if}
		</div>
	</div>

	{#if titleImageSrc}
		<img
			src={titleImageSrc}
			alt={altTitleImage}
			class="hidden sm:block sm:h-56 lg:h-96 max-h-96 object-cover"
		/>
	{/if}
</header>
