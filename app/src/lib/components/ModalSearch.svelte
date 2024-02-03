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
		'hidden md:flex items-center gap-2 bg-surface-300-600-token p-4 text-xs font-bold';

	let searchTerm = '';
	let results: any = '';
	let elemDocSearch: HTMLElement;
	let searchPerformed = false;
	let searchLoading = false;
	const searchDescription =
		'Fragen Sie unseren AI Assistenten um relevante Informationen zu finden.';

	async function search(): Promise<void> {
		if (!searchTerm.trim()) return;

		searchLoading = true;
		try {
			const response = await fetch(`/api/search?query=${encodeURIComponent(searchTerm)}`);
			results = response.json(); // Use the array of {title, slug}
		} catch (error) {
			console.error('There was a problem with the fetch operation:', error);
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
					<span class="material-symbols-outlined !text-4xl">search</span>
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
							<span class="hidden md:block text-xs opacity-50">/{result.slug}</span>
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
	<!-- Footer -->
	<footer class="modal-search-footer {cFooter}">
		<div><kbd class="kbd">Esc</kbd> Schließen</div>
		<div><kbd class="kbd">Tab</kbd> Navigieren</div>
		<div><kbd class="kbd">Enter</kbd> Auswählen</div>
	</footer>
</div>
