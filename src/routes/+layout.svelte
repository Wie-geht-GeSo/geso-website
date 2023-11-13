<script lang="ts">
	import '../app.postcss';
	import { AppShell, AppBar, LightSwitch } from '@skeletonlabs/skeleton';
	import Fa6SolidMagnifyingGlassPlus from '~icons/fa6-solid/magnifying-glass-plus';

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	// Navigation for Sidebar
	import Navigation from '$lib/Navigation/Navigation.svelte';
	// Drawer for Sidebar
	import { initializeStores, Drawer, getDrawerStore } from '@skeletonlabs/skeleton';
	initializeStores();
	const drawerStore = getDrawerStore();
	function drawerOpen(): void {
		drawerStore.open({});
	}
	import { page } from '$app/stores';
	// Disable sidebar for specific routes
	// $: classesSidebar = $page.url.pathname === '/' ? 'w-0' : 'w-0 lg:w-64';
	$: classesSidebar = 'w-0 lg:w-64';

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });


	export let data;

</script>

<Drawer>
	<h2 class="p-4">Navigation</h2>
	<hr />
	<Navigation />
</Drawer>

<!-- App Shell TODO: Replace hardcoded styling? -->
<AppShell slotSidebarLeft="bg-surface-500/5 {classesSidebar}">
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<div class="flex items-center">
					<button class="lg:hidden btn btn-sm mr-4" on:click={drawerOpen}>
						<span>
							<svg viewBox="0 0 100 80" class="fill-token w-4 h-4">
								<rect width="100" height="20" />
								<rect y="30" width="100" height="20" />
								<rect y="60" width="100" height="20" />
							</svg>
						</span>
					</button>
					<strong class="text-xl">{data.globals.website_name}</strong>
				</div>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<button class="btn btn-icon variant-filled">LL</button>
				<button class="btn btn-icon variant-filled">
					<Fa6SolidMagnifyingGlassPlus />
				</button>

				<button class="btn btn-icon variant-filled">
					<Fa6SolidMagnifyingGlassPlus />
				</button>

				<LightSwitch />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<!-- Left Sidebar Slot -->
	<svelte:fragment slot="sidebarLeft">
		<Navigation />
	</svelte:fragment>

	<!-- Page Route Content -->
	<slot />
</AppShell>
