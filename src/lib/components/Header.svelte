<script lang="ts">
	import { page } from '$app/stores';
	import { AppBar, getDrawerStore } from '@skeletonlabs/skeleton';
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
				<span>
					<svg viewBox="0 0 100 80" class="fill-token w-4 h-4">
						<rect width="100" height="20" />
						<rect y="30" width="100" height="20" />
						<rect y="60" width="100" height="20" />
					</svg>
				</span>
			</button>
			<a href="/home" class="flex items-center">
				<Logo />
				<strong class="text-xl hidden md:inline">{$page.data.globals.websiteName}</strong>
			</a>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<button class="btn btn-icon hidden sm:flex  variant-filled">
			<span class="material-icons">add</span>
		</button>
		<button class="btn btn-icon hidden sm:flex variant-filled">
			<span class="material-icons">remove</span>
		</button>
	</svelte:fragment>
</AppBar>
