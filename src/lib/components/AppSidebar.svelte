<script lang="ts">
	import { page } from '$app/stores';
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import { AppRail, AppRailAnchor } from '@skeletonlabs/skeleton';
	import type { NavigationPage } from '$lib/types/navigation/NavigationPage';
	import { traceNavigationPath } from '$lib/navigation';

	const drawerStore = getDrawerStore();
	function onClickAnchor(): void {
		// drawerStore.close();
	}

	// Reactive variables and computations
	const rootPage = $page.data.navigationTree as NavigationPage;
	const rootMenuItems = rootPage.childPages || [];
	$: currentSlug = $page.url.pathname.split('/').pop() || 'home';
	$: currentNavigationPath = traceNavigationPath(rootPage, currentSlug);
	$: activeSlugs = currentNavigationPath?.slugsPath ?? [];
	$: currentPage = currentNavigationPath?.page ?? null;
	$: parentPage = currentNavigationPath?.parent ?? null;
	$: currentSubMenuItems = currentPage?.childPages?.length
		? currentPage.childPages
		: parentPage?.childPages ?? [];

	
	// Helper functions
	$: isMenuItemActive = (slug: string): boolean => activeSlugs.includes(slug);
	const menuItemActiveClass = (slug: string): string =>
		isMenuItemActive(slug) ? 'bg-primary-active-token' : '';
</script>

<div class="grid grid-cols-[auto_1fr] h-full bg-surface-50-900-token border-r border-surface-500/30 {$$props.class ?? ''}">
	<AppRail class="w-24" background="bg-transparent" border="border-r border-surface-500/30">
		{#each rootMenuItems as menuItem (menuItem.id)}
			<AppRailAnchor 
				selected={isMenuItemActive(menuItem.slug)}
				href={menuItem.slug}
			>
				<svelte:fragment slot="lead">
					<span class="material-icons">{menuItem.icon}</span>
				</svelte:fragment>
				<span class="px-1">{menuItem.navigationTitle}</span>
			</AppRailAnchor>
		{/each}
	</AppRail>

	<section class="p-4 pb-20 space-y-4 overflow-y-auto">
		{#each currentSubMenuItems as subMenuItem (subMenuItem.id)}
			<nav class="list-nav">
				<ul>
					<li>
						<a href={subMenuItem.slug} class={menuItemActiveClass(subMenuItem.slug)}>
							<span class="flex-auto">{subMenuItem.navigationTitle}</span>
						</a>
					</li>
				</ul>
			</nav>
		{/each}
	</section>
</div>
