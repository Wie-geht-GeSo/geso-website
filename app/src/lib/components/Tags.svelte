<!-- Tags.svelte -->
<script lang="ts">
	export let tags: string[];
</script>

<div class="tag-container">
	{#each tags as tag}
		<div class="tag h6 pt-3">{tag}</div>
	{/each}
</div>

<style>
	.tag-container {
		display: flex;
		flex-wrap: wrap;
	}

	.tag {
		background-color: inherit;
		border: 2px solid rgb(var(--color-primary-500));
		border-radius: 9999px;
		padding: 4px 8px;
		margin: 4px;
	}
</style>
