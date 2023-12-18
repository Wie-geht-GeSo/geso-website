<script lang="ts">
	import { page } from '$app/stores';
	import Logo from './Logo.svelte';

	const versionInfo = `Version ${__VERSION__}`;
	// Base Classes
	const cBase =
		'bg-surface-50 dark:bg-surface-900 border-t border-surface-500/10 text-xs md:text-base';
	const cRowOne =
		'flex flex-col md:flex-row justify-between items-center md:items-start space-y-5 md:space-y-0';
	const cRowTwo =
		'flex flex-col md:flex-row justify-between items-center md:items-start space-y-4 md:space-y-0';

</script>

<div class="page-footer {cBase}">
	<div class="w-full max-w-7xl mx-auto p-4 py-5 space-y-10">
		<!-- Row 1 -->
		<section class={cRowOne}>
			<div
				class="grid grid-cols-1 gap-2 place-content-center place-items-center md:place-items-start"
			>
				<Logo />
				<p class="!text-sm text-center md:text-start">{$page.data.globals.websiteSlogan}</p>
				<p class="!text-sm mt-2 text-center md:text-start dynamic-html">{@html $page.data.footer.content || ""}</p>
			</div>
			<div class="grid grid-cols-3 md:gap-20 text-center md:text-start">
				{#each $page.data.footer.blocks as block (block.id)}
					{#if block.collection === 'blockLinkGroup'}
						<div class="space-y-6">
							<h6 class="h6">{block.item.title}</h6>
							<ul class="space-y-3">
								{#each block.item.links as link}
									<li><a class="anchor" href={link.url ?? link.page.slug}>{link.name}</a></li>
								{/each}
							</ul>
						</div>
					{/if}
				{/each}
			</div>
		</section>

		<hr class="opacity-20" />

		<!-- Row 2 -->
		<section class={cRowTwo}>
			<p>
				{#each $page.data.footer.bottomLinks as bottomLink, index}
					<a class="anchor" target="_blank" rel="noreferrer" href={bottomLink.url}>
						{bottomLink.name || bottomLink.url}
					</a>
					{#if index < $page.data.footer.bottomLinks.length - 1}
						<span class="opacity-10 mx-2">|</span>
					{/if}
				{/each}
			</p>
			<p class="!text-sm opacity-80">{versionInfo}</p>
			<p class="!text-sm opacity-80">
				Entwickelt von <a
					class="anchor"
					href="https://github.com/JohannesPertl/"
					target="_blank"
					rel="noreferrer">Johannes Pertl</a
				>
			</p>
		</section>
	</div>
</div>
