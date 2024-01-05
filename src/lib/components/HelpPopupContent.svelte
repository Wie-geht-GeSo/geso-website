<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
    import { triggerContactModal } from '$lib/utils';

	const modalStore = getModalStore();

	function onContactClick(e: MouseEvent): void {
        triggerContactModal(modalStore);
	}
</script>

<div class="card p-3 w-auto shadow-xl" data-popup="help">
	<nav class="list-nav">
		<ul>
			<li>
				<a href="/faq">
					<span class="material-symbols-outlined">question_mark</span>
					<span class="sm:hidden">Fragen</span>
					<span class="hidden sm:inline">Häufig gestellte Fragen</span>
				</a>
			</li>
			<li>
				<button on:click={onContactClick}>
					<span class="material-symbols-outlined">mail</span>
					<span>Kontakt</span>
					<button />
				</button>
			</li>
		</ul>
	</nav>
</div>
