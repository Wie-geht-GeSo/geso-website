<script lang="ts">
	import { browser } from '$app/environment';
	import TreeViewItemContent from './TreeViewItemContent.svelte';
	import type { NavigationPage } from '$lib/types/navigation/NavigationPage';
	import { RecursiveTreeView, type TreeViewNode } from '@skeletonlabs/skeleton';
	import {
		currentNavigationPathSlugs,
		currentNavigationPath,
		rootMenuItems
	} from '$lib/stores/navigationStore';
	import { onDestroy, onMount } from 'svelte';
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

	$: currentActiveRootMenuItem = $rootMenuItems.find((menuItem) =>
		$currentNavigationPathSlugs.includes(menuItem.slug)
	);

	// Set treeViewNodes to all nodes on narrow screens, or all subnodes of the active AppRail menu item on desktop
	$: treeViewNodes = isNarrowScreen
		? $rootMenuItems.map(convertToTreeViewNode)
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
</script>


<div class="py-4 pb-24">
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
</div>
