<script lang="ts">
	import { TabGroup, TabAnchor, Tab, getDrawerStore } from '@skeletonlabs/skeleton';
	import { currentSlug } from '$lib/stores/navigationStore';

	const drawerStore = getDrawerStore();
	// TODO: Use cms data
	let mobileNavigationItems = [
		{
			slug: 'home',
			icon: 'home',
			title: 'Start'
		},
		// {
		// 	slug: 'faq',
		// 	icon: 'contact_support',
		// 	title: 'Hilfe'
		// }
	];

	$: isMenuItemActive = (slug: string) => $currentSlug === slug;

	function onMenuClick() {
		drawerStore.open();
	}


	function onSearchClick(e: MouseEvent): void {
		// TODO: Implement
		throw new Error('Function not implemented.');
	}
</script>

<TabGroup
	justify="justify-center"
	active="variant-filled-primary"
	flex="flex-1"
	rounded=""
	border=""
	class="bg-surface-100-800-token w-auto {$$props.class}"
>
	<TabAnchor
	on:click={onMenuClick}
	>
		<svelte:fragment slot="lead">
			<span class="material-symbols-outlined pt-2">menu</span>
		</svelte:fragment>	
		<span>Menü</span>
	</TabAnchor>
	{#each mobileNavigationItems as item}
		<TabAnchor href={item.slug} selected={isMenuItemActive(item.slug)}>
			<svelte:fragment slot="lead">
				<span class="material-symbols-outlined pt-2">{item.icon}</span>
			</svelte:fragment>
			<span>{item.title}</span>
		</TabAnchor>
	{/each}
	<TabAnchor
	on:click={onSearchClick}
	>
		<svelte:fragment slot="lead">
			<span class="material-symbols-outlined pt-2">search</span>
		</svelte:fragment>	
		<span>Suche</span>
	</TabAnchor>
</TabGroup>
