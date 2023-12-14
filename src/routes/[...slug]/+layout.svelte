<script lang="ts">
	import '../../app.postcss';
	import '../../app.css';
	import 'material-symbols';
	import { AppShell, autoModeWatcher, getDrawerStore, prefersReducedMotionStore } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { initializeStores, Drawer } from '@skeletonlabs/skeleton';
	import AppSidebar from '$lib/components/AppSidebar.svelte';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { page } from '$app/stores';
	import { Toast } from '@skeletonlabs/skeleton';
	import MobileNavigationTabs from '$lib/components/MobileNavigationTabs.svelte';
	import TreeView from '$lib/components/TreeMenu.svelte';
	// import MobileNavigationTabs from '$lib/components/MobileNavigationTabs.svelte';

	initializeStores();
	const drawerStore = getDrawerStore();
	// Disable smooth scrolling for users who prefer reduced motion
	$: allyPageSmoothScroll = !$prefersReducedMotionStore ? 'scroll-smooth' : '';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	function hideSidebarFor(pageUrlPath: string): boolean {
		if (pageUrlPath === '/home') return true;
		return false;
	}

	$: slotSidebarLeft = hideSidebarFor($page.url.pathname)
		? 'w-0'
		: 'bg-surface-50-900-token lg:w-auto';
</script>

<svelte:head
	>{@html `<script>${autoModeWatcher.toString()} autoModeWatcher();</script>`}</svelte:head
>

<Drawer class="lg:hidden">
	<TreeView />
	<button class="btn btn-sm variant-outline absolute bottom-7 left-7" on:click={() => drawerStore.close()}>
		<span class="material-symbols-outlined">close</span>
		<span>Schließen</span>
	</button>
</Drawer>
<Toast />
<AppShell {slotSidebarLeft} regionPage={allyPageSmoothScroll}>
	<svelte:fragment slot="header">
		<Header />
	</svelte:fragment>

	<svelte:fragment slot="sidebarLeft">
		<AppSidebar class="hidden lg:grid overflow-hidden" />
	</svelte:fragment>

	<svelte:fragment slot="pageFooter">
		<Footer />
	</svelte:fragment>

	<svelte:fragment slot="footer">
		<MobileNavigationTabs class="md:hidden" />
	</svelte:fragment>

	<slot />
</AppShell>
