<script lang="ts">
	import type { LinkBlock } from '$lib/types/blocks/LinkBlock';

	export let data: LinkBlock;
</script>

{#if data && data.name && (data.page || data.url)}
	<a
		href={data.page ? data.page.slug : data.url}
		target={data.page ? undefined : '_blank'}
		rel={data.page ? undefined : 'noreferrer'}
		class="btn variant-glass-primary rounded-md flex whitespace-normal justify-between items-center py-4"
	>
		<div class="flex items-center">
			{#if data.page && data.page.icon}
				<span class="material-symbols-outlined mr-2">{data.page.icon}</span>
			{/if}
			<span class="">{data.name}</span>
		</div>
		<span class="material-symbols-outlined">arrow_forward</span>
	</a>
{/if}
