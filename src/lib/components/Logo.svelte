<script lang="ts">
    import { page } from '$app/stores';
    export let className = '';
</script>

<!-- TODO: Add dark mode logo -->
<div class="flex items-center">
    <!-- TODO: Add dark mode logo -->
    <img src={$page.data.globals.logoLightModePath} alt="Logo" class="w-6 sm:w-8 {className} mr-2" />
    <strong class="h3">{$page.data.globals.websiteName}</strong>
</div>