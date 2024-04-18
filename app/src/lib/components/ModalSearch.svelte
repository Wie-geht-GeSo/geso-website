<script lang="ts">
	import { ProgressRadial, getModalStore } from '@skeletonlabs/skeleton';
	const modalStore = getModalStore();

	const cBase =
		'card bg-surface-100/60 dark:bg-surface-500/30 backdrop-blur-lg overflow-hidden w-full max-w-[800px] shadow-xl mt-8 mb-auto';
	const cHeader = 'bg-surface-300-600-token flex items-center';
	const cResults = 'overflow-x-auto max-h-[480px] hide-scrollbar';
	const cResultAnchor =
		'!rounded-none justify-between hover:variant-soft focus:!variant-filled-primary outline-0';
	const cFooter =
		'hidden md:flex items-center gap-2 p-4 text-xs font-bold justify-center';

	let searchTerm = '';
	let results: any = '';
	let elemDocSearch: HTMLElement;
	let searchPerformed = false;
	let searchLoading = false;
	const searchDescription =
		'🤖 Unsere intelligente Suche denkt mit – probieren Sie einzelne Begriffe, ganze Sätze oder Fragen aus.';

	async function search(): Promise<void> {
		if (!searchTerm.trim()) return;

		searchLoading = true;
		try {
			const response = await fetch(`/api/search?query=${encodeURIComponent(searchTerm)}`);
			results = await response.json(); // Use the array of {title, slug}
		} catch (error) {
			console.error("Couldn't reach search api: ", error);
			results = [];
		} finally {
			searchLoading = false;
			searchPerformed = true;
		}
	}

	function onKeyDown(event: KeyboardEvent): void {
		if (event.key === 'Enter') {
			search();
		}
	}
</script>

<div bind:this={elemDocSearch} class="modal-search {cBase}">
	<header class="modal-search-header {cHeader}">
		<div
			class="input-group input-group-divider grid-cols-[1fr_auto] rounded-lg bg-transparent variant-form-material"
		>
			<input
				class="bg-transparent border-0 focus:outline-none w-full text-lg"
				bind:value={searchTerm}
				type="search"
				placeholder="Suchbegriff oder Frage"
				on:keydown={onKeyDown}
			/>
			{#if searchLoading}
				<button class="variant-filled-secondary" disabled>
					<ProgressRadial width="w-9" />
				</button>
			{:else}
				<button class="variant-filled-secondary" on:click={search}>
					<span class="material-symbols-outlined !text-3xl">search</span>
					<span class="pl-1 font-bold">Suchen</span>
				</button>
			{/if}
		</div>
	</header>
	<!-- Results -->
	{#if results.length > 0}
		<nav class="list-nav {cResults}" tabindex="-1">
			<ul>
				{#each results as result}
					<li class="text-lg">
						<a class={cResultAnchor} href={`/${result.slug}`} on:click={() => modalStore.close()}>
							<div class="flex items-center gap-4">
								<i class="fa-regular fa-file" />
								<span class="flex-auto font-bold opacity-75">{result.title}</span>
							</div>
							<span class="hidden md:block text-xs opacity-50">{result.subTitle || ""}</span>
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	{:else if searchPerformed}
		<div class="p-4">
			<p>Es wurden keine Ergebnisse gefunden.</p>
			<p class="mt-5">
				{searchDescription}
			</p>
		</div>
	{:else}
		<div class="p-4">
			<p>
				{searchDescription}
			</p>
		</div>
	{/if}
</div>
