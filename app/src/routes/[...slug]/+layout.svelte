<script lang="ts">
	import ModalSearch from './../../lib/components/ModalSearch.svelte';
	import ModalContactForm from './../../lib/components/ModalContactForm.svelte';
	import { currentSlug } from '$lib/stores/navigationStore';
	import '../../app.postcss';
	import '../../app.css';
	import 'material-symbols';
	import {
		AppShell,
		autoModeWatcher,
		getDrawerStore,
		prefersReducedMotionStore,
		type ModalComponent,
		Modal
	} from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { initializeStores, Drawer } from '@skeletonlabs/skeleton';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { Toast } from '@skeletonlabs/skeleton';
	import MobileNavigationTabs from '$lib/components/MobileNavigationTabs.svelte';
	import TreeView from '$lib/components/TreeMenu.svelte';
	import { isStandalonePage } from '$lib/utils';
	import { afterNavigate } from '$app/navigation';

	initializeStores();
	const drawerStore = getDrawerStore();
	const modalRegistry: Record<string, ModalComponent> = {
		modalContactForm: { ref: ModalContactForm },
		modalSearch: { ref: ModalSearch }
	};

	// Workaround to fix sveltekit scroll reset bug
	// https://github.com/sveltejs/kit/issues/2733
	afterNavigate(() => {
		document.getElementById('page')?.scrollTo(0, 0);
	});

	// Disable smooth scrolling for users who prefer reduced motion
	$: allyPageSmoothScroll = !$prefersReducedMotionStore ? 'scroll-smooth' : '';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	$: slotSidebarLeft = isStandalonePage($currentSlug) ? 'w-0' : 'bg-surface-50-900-token lg:w-auto';
</script>

<svelte:head
	>{@html `<script>${autoModeWatcher.toString()} autoModeWatcher();</script>`}</svelte:head
>

<Drawer class="lg:hidden">
	<TreeView />
	<button
		class="btn btn-sm variant-outline absolute bottom-7 left-7"
		on:click={() => drawerStore.close()}
	>
		<span class="material-symbols-outlined">close</span>
		<span>Schließen</span>
	</button>
</Drawer>
<Toast />
<Modal components={modalRegistry} />
<AppShell {slotSidebarLeft} regionPage={allyPageSmoothScroll}>
	<svelte:fragment slot="header">
		<Header />
	</svelte:fragment>

	<svelte:fragment slot="sidebarLeft">
		<Sidebar className="hidden lg:grid overflow-hidden" />
	</svelte:fragment>

	<svelte:fragment slot="pageFooter">
		<Footer />
	</svelte:fragment>

	<svelte:fragment slot="footer">
		<MobileNavigationTabs className="md:hidden" />
	</svelte:fragment>

	<slot />
</AppShell>
