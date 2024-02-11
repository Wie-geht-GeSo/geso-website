<script lang="ts">
	import type { SmallTextBlock } from '$lib/types/blocks/SmallTextBlock';

	export let data: SmallTextBlock;
	$: smallText = data?.smallText;
</script>

{#if smallText && smallText.content}
	<p class="!text-sm opacity-80">{@html smallText.content}</p>
{/if}
