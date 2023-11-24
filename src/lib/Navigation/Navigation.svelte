<script lang="ts">
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	const drawerStore = getDrawerStore();

	function drawerClose(): void {
		drawerStore.close();
	}
</script>

<nav class="list-nav p-4">
	<ul>
		{#each $page.data.navigationPages as navPage}
			<li>
				<a href={navPage.slug} on:click={drawerClose}>
					<span class="material-icons pr-2">{navPage.icon}</span>
					{navPage.title}
				</a>
			</li>
		{/each}
	</ul>
</nav>
