<script lang="ts">
	import { TabGroup, TabAnchor, getDrawerStore } from '@skeletonlabs/skeleton';
	export let className = '';

	const drawerStore = getDrawerStore();
	let mobileNavigationItems = [
		{
			slug: 'home',
			icon: 'home',
			title: 'Start'
		}
	];


	function onMenuClick() {
		drawerStore.open();
	}

	function onSearchClick(e: MouseEvent): void {
		// TODO: Implement
		throw new Error('Function not implemented.');
	}

	const iconClasses = 'material-symbols-outlined !text-xl';
</script>

<TabGroup
	justify="justify-center"
	active="variant-filled-primary"
	flex="flex-1"
	rounded=""
	border=""
	class="bg-surface-100-800-token w-auto {className}"
	padding="px-3 py-1"
	spacing="space-y-0"
	regionList="text-xs"
>
	<TabAnchor on:click={onMenuClick}>
		<svelte:fragment slot="lead">
			<span class={iconClasses}>menu</span>
		</svelte:fragment>
		<span>Menü</span>
	</TabAnchor>
	{#each mobileNavigationItems as item}
		<TabAnchor href={item.slug}>
			<svelte:fragment slot="lead">
				<span class={iconClasses}>{item.icon}</span>
			</svelte:fragment>
			<span>{item.title}</span>
		</TabAnchor>
	{/each}
	<TabAnchor on:click={onSearchClick}>
		<svelte:fragment slot="lead">
			<span class={iconClasses}>search</span>
		</svelte:fragment>
		<span>Suche</span>
	</TabAnchor>
</TabGroup>
