<script lang="ts">
	import type { LinkBlock } from "$lib/types/blocks/LinkGroupBlock";

    export let linkBlock: LinkBlock;
</script>

<a
	href={linkBlock.page ? linkBlock.page.slug : linkBlock.url}
	target={linkBlock.page ? undefined : '_blank'}
	rel={linkBlock.page ? undefined : 'noreferrer'}
	class="btn variant-glass-secondary rounded-md flex whitespace-normal justify-between items-center py-4"
>
	{#if linkBlock.page && linkBlock.page.icon}
		<span class="material-symbols-outlined">{linkBlock.page.icon}</span>
	{/if}
	<span class="">{linkBlock.name}</span>
	<span class="material-symbols-outlined">arrow_forward</span>
</a>
