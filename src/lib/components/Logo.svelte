<script lang="ts">
    import { page } from '$app/stores';
    $: console.log($page.url.pathname)
</script>

<!-- TODO: Add dark mode logo -->
<img src={$page.data.globals.logoLightModePath} alt="Logo" class="w-16 mr-4" />
