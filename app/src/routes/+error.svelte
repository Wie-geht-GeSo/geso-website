<script>
    import { page } from '$app/stores';
    import '../app.postcss';
	import '../app.css';
</script>

<div class="flex flex-col items-center justify-center h-screen">
    {#if $page.error}
        <h1 class="text-4xl font-bold mb-4 text-teal-500">Ups! Etwas ist schiefgelaufen.</h1>
        <p class="text-lg text-gray-400 mb-8">{$page.error.message}</p>
        <p class="text-lg mb-8">Bitte versuchen Sie es später nochmal.</p>
    {/if}
</div>
