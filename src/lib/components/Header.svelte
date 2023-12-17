<script lang="ts">
	import { page } from '$app/stores';
	import {
		AppBar,
		LightSwitch,
		getDrawerStore,
		type ModalSettings,
		getModalStore
	} from '@skeletonlabs/skeleton';
	import Logo from './Logo.svelte';
	import ZoomButtons from './ZoomButtons.svelte';

	const drawerStore = getDrawerStore();
	function drawerOpen(): void {
		drawerStore.open({});
	}
	const modalStore = getModalStore();

	function triggerSearch(): void {
		const modal: ModalSettings = {
			type: 'component',
			component: 'modalSearch',
			position: 'item-start'
		};
		modalStore.trigger(modal);
	}
</script>

<AppBar shadow="shadow-xl">
	<svelte:fragment slot="lead">
		<div class="flex items-center">
			<button class="btn hidden md:block lg:hidden" on:click={drawerOpen}>
				<span class="material-symbols-outlined"> menu </span>
			</button>
			<a href="/home" class="flex items-center">
				<Logo className="ml-3 mr-2"/>
			</a>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<!-- Search -->
		<div class="hidden md:inline md:ml-4">
			<button
				class="btn space-x-4 variant-soft hover:variant-soft-secondary"
				on:click={triggerSearch}
			>
				<span class="material-symbols-outlined">search</span>
				<small class="hidden md:inline-block">Suche</small>
			</button>
		</div>
		
		<ZoomButtons />
		
		{#if $page.data.header.lightSwitch}
			<LightSwitch />
		{/if}
	</svelte:fragment>
</AppBar>
