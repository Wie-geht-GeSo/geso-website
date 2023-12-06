<script lang="ts">
	import { page } from '$app/stores';
	import { AppBar, LightSwitch, getDrawerStore } from '@skeletonlabs/skeleton';
	import Logo from './Logo.svelte';

	const drawerStore = getDrawerStore();
	function drawerOpen(): void {
		drawerStore.open({});
	}

</script>

<AppBar shadow="shadow-xl">
	<svelte:fragment slot="lead">
		<div class="flex items-center">
			<button class="lg:hidden btn mr-2" on:click={drawerOpen}>
				<span class="material-symbols-outlined">
					menu
				</span>
			</button>
			<a href="/home" class="flex items-center">
				<Logo />
				<strong class="text-xl hidden md:inline">{$page.data.globals.websiteName}</strong>
			</a>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<button class="btn btn-icon-sm hidden sm:flex variant-filled">
			<span class="material-symbols-outlined">add</span>
		</button>
		<button class="btn btn-icon-sm hidden sm:flex variant-filled">
			<span class="material-symbols-outlined">remove</span>
		</button>
		{#if $page.data.header.lightSwitch}
			<LightSwitch />
		{/if}
	</svelte:fragment>
</AppBar>
