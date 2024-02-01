<script lang="ts">
	import { page } from '$app/stores';
	export let className = '';
</script>

<!-- TODO: Add dark mode logo -->
<div class="flex items-center">
	<!-- TODO: Add dark mode logo -->
	{#if $page?.data?.globals?.logoLightModePath}
		<img
			src={$page.data.globals.logoLightModePath}
			alt="Logo"
			class="w-6 sm:w-8 {className} mr-2"
		/>
	{/if}
	<strong class="h3">{$page?.data?.globals?.websiteName || 'GeSo'}</strong>
</div>
