<script lang="ts">
	import type { ContentBlock } from "$lib/types/blocks/ContentBlock";

	export let contentBlock: ContentBlock;
</script>

<div class="blockContent">
	{#if contentBlock.title}
		<h2>{contentBlock.title}</h2>
	{/if}
	<div class="dynamic-html">
		{@html contentBlock.content}
	</div>
</div>
