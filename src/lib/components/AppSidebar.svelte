<script lang="ts">
	import { page } from '$app/stores';
	import { RecursiveTreeView, type TreeViewNode } from '@skeletonlabs/skeleton';
	import { AppRail, AppRailAnchor } from '@skeletonlabs/skeleton';
	import type { NavigationPage } from '$lib/types/navigation/NavigationPage';
	import { currentNavigationPathSlugs, currentNavigationPath } from '$lib/stores/navigationStore';
	import TreeViewItemContent from './TreeViewItemContent.svelte';
	import { afterUpdate, onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';

	/* Detect mobile */
	let isNarrowScreen = false;
	// Function to check and update the screen width status
	function updateScreenWidth() {
		// Ensure window is defined (i.e., running in the browser)
		if (browser) {
			if (typeof window !== 'undefined') {
				isNarrowScreen = window.innerWidth < 1280;
			}
		}
	}

	onMount(() => {
		// Initial check
		updateScreenWidth();
		// Set up event listener for window resize
		window.addEventListener('resize', updateScreenWidth);
	});

	// Clean up the event listener when the component is destroyed
	onDestroy(() => {
		if (browser) window.removeEventListener('resize', updateScreenWidth);
	});

	/* Reactive variables and computations */
	$: rootMenuItems = ($page.data.navigationTreeRoot?.childPages as NavigationPage[]) || []; // rootPage is not a menu item
	$: currentActiveRootMenuItem = rootMenuItems.find((menuItem) =>
		$currentNavigationPathSlugs.includes(menuItem.slug)
	);

	// Convert NavigationPage to TreeViewNode recursively
	function convertToTreeViewNode(page: NavigationPage): TreeViewNode {
		return {
			id: page.slug,
			content: TreeViewItemContent,
			contentProps: {
				slug: page.slug,
				title: page.navigationTitle,
				icon: page.icon,
				expandedNodes: expandedNodes
			},
			children: page.childPages?.map(convertToTreeViewNode)
		};
	}
	// Set treeViewNodes to all nodes on narrow screens, or all subnodes of the active AppRail menu item on desktop
	$: treeViewNodes = isNarrowScreen
		? rootMenuItems.map(convertToTreeViewNode)
		: currentActiveRootMenuItem?.childPages
		? currentActiveRootMenuItem.childPages.map(convertToTreeViewNode)
		: [];

	let expandedNodes: string[] = [];
	// Expand correct nodes when navigating to a new page
	$: if (!expandedNodes.length) {
		expandedNodes =
			$currentNavigationPath && $currentNavigationPath.slugsPath
				? $currentNavigationPath.slugsPath.slice(0, -1)
				: [];
	}

	$: isRootMenuItemActive = (slug: string): boolean => $currentNavigationPathSlugs.includes(slug);
</script>

<div
	class="grid grid-cols-[auto_1fr] h-full bg-surface-50-900-token border-r border-surface-500/30 {$$props.class}"
>
	<AppRail
		class="hidden xl:grid"
		width="w-24"
		background="bg-transparent"
		border="border-r border-surface-500/30"
	>
		{#each rootMenuItems as menuItem}
			<AppRailAnchor selected={isRootMenuItemActive(menuItem.slug)} href={menuItem.slug}>
				<svelte:fragment slot="lead">
					<span class="material-symbols-rounded">{menuItem.icon}</span>
				</svelte:fragment>
				<span class="px-1">{menuItem.navigationTitle}</span>
			</AppRailAnchor>
		{/each}
	</AppRail>

	<section class="pt-4 pl-2 pb-20 overflow-y-auto min-w-0 w-[350px] md:w-[300px] xl:w-[400px]">
		<RecursiveTreeView
			nodes={treeViewNodes}
			bind:expandedNodes
			regionSummary="justify-start pl-5 mr-3"
			padding="py-0"
			indent="ml-2 md:ml-3"
			spacing="space-y-3 lg:space-y-4"
			labelledby="Navigationsbaum"
			hyphenOpacity="opacity-30"
		/>
	</section>
</div>
