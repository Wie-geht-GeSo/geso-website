<script lang="ts">
	import type { SmallTextBlock } from "$lib/types/blocks/SmallTextBlock";

	export let data: SmallTextBlock;
</script>

<p class="!text-sm opacity-80">{@html data.content}</p>