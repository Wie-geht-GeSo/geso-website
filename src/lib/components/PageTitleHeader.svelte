<script lang="ts">
	import { isStandalonePage } from '$lib/utils';
	import {
		currentSlug
	} from '$lib/stores/navigationStore';
    import { browser } from '$app/environment';


    export let scrollToElement: HTMLElement;
    export let title: string;
    export let subTitle: string | null;
    export let titleImageSrc: string | null;

    function goBack() {
		history.back();
	}

	function scrollToContent() {
		if (browser && scrollToElement) {
			scrollToElement.scrollIntoView({ behavior: 'smooth' });
		}
	}

	let noBackButtonSlugs = ['home'];
	$: includeBackButton = !noBackButtonSlugs.includes($currentSlug);
    $: isHomePage = $currentSlug === 'home';

</script>

<header class="flex items-center {isStandalonePage($currentSlug) ? 'justify-center' : 'justify-start'} py-10 sm:py-0 space-x-32">
	<div>
		{#if includeBackButton}
			<div class="flex items-start space-x-4 py-5">
				<button
					class="btn btn-sm variant-outline-secondary hover:variant-filled-secondary"
					on:click={goBack}
				>
					<span class="material-symbols-outlined">arrow_back</span>
					<span>Zurück</span>
				</button>
			</div>
		{/if}
		<h1 class="h1 {isHomePage ? 'font-bold' : ''}">
			<span class="title-gradient">{title}</span>
		</h1>
		{#if subTitle}
			<p class="h4 pt-3">{subTitle}</p>
		{/if}
		{#if isHomePage}
			<button
				class="btn variant-outline-primary hover:variant-filled-primary mt-10"
				on:click={scrollToContent}
			>
				<span>Start</span>
				<span class="material-symbols-outlined">expand_more</span>
			</button>
		{/if}
	</div>

	{#if titleImageSrc}
		<img
			src={titleImageSrc}
			alt="Titelbild"
			class="hidden sm:block sm:w-1/3 lg:w-1/2 max-w-xs object-cover mx-auto"
			/>
	{/if}
</header>
