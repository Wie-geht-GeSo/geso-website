<script lang="ts">
	import { page } from '$app/stores';
	import {
		AppBar,
		LightSwitch,
		getDrawerStore,
		type ModalSettings,
		getModalStore,
		type PopupSettings,
		popup
	} from '@skeletonlabs/skeleton';
	import Logo from './Logo.svelte';
	import ZoomButtons from './ZoomButtons.svelte';
	import HelpPopupContent from './HelpPopupContent.svelte';

	const drawerStore = getDrawerStore();
	const modalStore = getModalStore();
	
	function drawerOpen(): void {
		drawerStore.open({});
	}

	function triggerSearch(): void {
		const modal: ModalSettings = {
			type: 'component',
			component: 'modalSearch',
			position: 'item-start'
		};
		modalStore.trigger(modal);
	}


	const helpPopup: PopupSettings = {
		event: 'click',
		target: 'help',
		placement: 'bottom'
	};
</script>

<AppBar shadow="shadow-xl" gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
	<svelte:fragment slot="lead">
		<div class="flex items-center">
			<button class="btn hidden md:block lg:hidden" on:click={drawerOpen}>
				<span class="material-symbols-outlined"> menu </span>
			</button>
			<a href="/home" class="flex items-center">
				<Logo className="ml-3 mr-2" />
			</a>
		</div>
	</svelte:fragment>

	<!-- Search -->
	<div class="hidden md:inline md:ml-4">
		<button
			class="btn space-x-3 variant-soft-secondary hover:variant-filled-secondary"
			on:click={triggerSearch}
			aria-label="Suche"
		>
			<span class="material-symbols-outlined">search</span>
			<small class="hidden md:inline-block font-bold">Suche</small>
		</button>
	</div>

	<svelte:fragment slot="trail">

		<!-- Help Popup -->
		<div class="">
			<button class="btn btn-sm sm:btn-base hover:variant-filled-primary" use:popup={helpPopup}>
				<span class="material-symbols-outlined">help_outline</span>
				<span>Hilfe</span>
				<span class="material-symbols-outlined">expand_more</span>
			</button>

			<HelpPopupContent />
		</div>

		

		<ZoomButtons />

		{#if $page?.data?.header?.lightSwitch !== false}
			<LightSwitch />
		{/if}
	</svelte:fragment>
</AppBar>
