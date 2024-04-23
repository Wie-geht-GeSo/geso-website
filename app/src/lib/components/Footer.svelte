<script lang="ts">
	import { page } from '$app/stores';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import Logo from './Logo.svelte';
	import { triggerContactModal } from '$lib/utils';

	const modalStore = getModalStore();

	function onContactClick(e: MouseEvent): void {
		triggerContactModal(modalStore);
	}

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
	<div class="w-full max-w-7xl mx-auto p-4 py-5 space-y-5">
		<!-- Row 1 -->
		<section class={cRowOne}>
			<div
				class="grid grid-cols-1 gap-2 place-content-center place-items-center md:place-items-start"
			>
				<Logo />
				<p class="!text-sm text-center md:text-start">
					{$page?.data?.globals?.websiteSlogan ||
						'Digitaler Wegweiser durch das Gesundheits- und Sozialsystem.'}
				</p>
				<p class="!text-sm mt-2 text-center md:text-start dynamic-html">
					{@html $page?.data?.footer?.content || ''}
				</p>
			</div>
			<div class="grid grid-cols-3 md:gap-20 text-center md:text-start">
				{#if $page?.data?.footer && $page?.data?.footer?.blocks}
					{#each $page.data.footer.blocks as block (block.id)}
						{#if block.collection === 'blockLinkGroup'}
							<div class="space-y-6">
								<h6 class="h6">{block.item.title}</h6>
								<ul class="space-y-3">
									{#each block.item.links || [] as link}
										{#if link.contactForm}
											<li>
												<button class="anchor" on:click={onContactClick}>{link.name}</button>
											</li>
										{:else}
											<li>
												<a class="anchor" href={link.url ?? link.page.slug}>{link.name}</a>
											</li>
										{/if}
									{/each}
								</ul>
							</div>
						{/if}
					{/each}
				{/if}
			</div>
		</section>

		<hr class="opacity-20" />

		<!-- Row 2 -->
		<section class={cRowTwo}>
			<p class="!text-xs opacity-80">
				Inhalt: <a
					class="anchor"
					href="https://sophi.at"
					target="_blank"
					rel="noreferrer">sophi</a
				>
			</p>
			{#if $page?.data?.footer?.showVersion}
				<p class="!text-xs opacity-80">{versionInfo}</p>
			{/if}
			<p class="!text-xs opacity-80">
				Webentwicklung: <a
					class="anchor"
					href="https://www.linkedin.com/in/johannes-pertl-54b74b190/"
					target="_blank"
					rel="noreferrer">Johannes Pertl</a
				>
			</p>
		</section>
	</div>
</div>
