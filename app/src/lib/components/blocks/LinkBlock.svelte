<script lang="ts">
	import type { LinkBlock } from '$lib/types/blocks/LinkBlock';

	export let data: LinkBlock;
	$: link = data?.link;
</script>

{#if link && link.name && (link.page || link.url)}
	<a
		href={link.page ? link.page.slug : link.url}
		target={link.page ? undefined : '_blank'}
		rel={link.page ? undefined : 'noreferrer'}
		class="btn variant-glass-primary rounded-md flex whitespace-normal justify-between items-center py-4"
	>
		<div class="flex items-center">
			{#if link.page && link.page.icon}
				<span class="material-symbols-outlined mr-2">{link.page.icon}</span>
			{/if}
			<span class="">{link.name}</span>
		</div>
		<span class="material-symbols-outlined">arrow_forward</span>
	</a>
{/if}
