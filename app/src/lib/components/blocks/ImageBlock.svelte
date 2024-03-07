<script lang="ts">
	import type { ImageBlock } from '$lib/types/blocks/ImageBlock';

	export let data: ImageBlock;
	$: image = data?.image;
</script>

{#if image && image.imageSrc}
<figure>
	<img src={image.imageSrc} alt={image.alt} class="h-auto max-w-full rounded-lg" />
	{#if image.caption}
		<figcaption class="!text-sm opacity-80">{image.caption}</figcaption>
	{/if}
</figure>
{/if}
