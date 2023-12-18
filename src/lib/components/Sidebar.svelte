<script lang="ts">
	import { AppRail, AppRailAnchor } from '@skeletonlabs/skeleton';
	import { currentNavigationPathSlugs, rootMenuItems } from '$lib/stores/navigationStore';
	import TreeMenu from './TreeMenu.svelte';
	export let className = '';

	$: isRootMenuItemActive = (slug: string): boolean => $currentNavigationPathSlugs.includes(slug);
</script>


<div
	class="grid grid-cols-[auto_1fr] h-full border-r border-surface-500/30 {className}"
>
	<AppRail
		class="hidden xl:grid"
		width="w-24"
		background="bg-transparent"
		border="border-r border-surface-500/30"
	>
		{#each $rootMenuItems as menuItem}
			<AppRailAnchor selected={isRootMenuItemActive(menuItem.slug)} href={menuItem.slug}>
				<svelte:fragment slot="lead">
					<span class="material-symbols-outlined">{menuItem.icon}</span>
				</svelte:fragment>
				<span class="px-1">{menuItem.navigationTitle}</span>
			</AppRailAnchor>
		{/each}
	</AppRail>

	<section class="pl-2 overflow-y-auto min-w-0 w-[500px] md:w-[300px] xl:w-[350px]">
		<TreeMenu />
	</section>
</div>
