<script lang="ts">
	import { currentSlug } from '$lib/stores/navigationStore';
	import { getDrawerStore } from '@skeletonlabs/skeleton';

	export let slug: string;
	export let title: string;
	export let icon: string;
	export let expandedNodes: string[] = [];

	const drawerStore = getDrawerStore();

	const handleClick = () => {
        // Also open nodes on button click
		if (active) {
			expandedNodes = expandedNodes.filter((node) => node !== slug);
		} else {
			drawerStore.close();
			if (!expandedNodes.includes(slug)) {
				expandedNodes.push(slug);
			}
		}
	};

	$: active = $currentSlug === slug;
</script>

<a
	href={slug}
	class="btn rounded-lg pl-1 hover:variant-filled flex whitespace-normal justify-start py-4 w-full h-full {active
		? 'bg-primary-active-token hover:variant-filled-primary'
		: ''}"
	on:click={handleClick}
>
	<span class="material-symbols-rounded">{icon}</span>
	<span>{title}</span>
</a>

<style>
	:global(.tree-item-content) {
		width: 100%;
		height: 100%;
	}

    /* Workaround to remove btn hover styles */
    .btn:hover {
    --tw-brightness: brightness(100%);
    --tw-blur: blur(0);
    --tw-contrast: contrast(100%);
    --tw-grayscale: grayscale(0%);
    --tw-hue-rotate: hue-rotate(0deg);
    --tw-invert: invert(0%);
    --tw-saturate: saturate(100%);
    --tw-sepia: sepia(0%);
    --tw-drop-shadow: drop-shadow(0 0 0 transparent);

    filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

</style>
