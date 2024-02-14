<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	import { getModalStore, getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import type { Feedback } from '$lib/types/Feedback';

	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	const formData: Feedback = {
		subject: '',
		message: '',
		email: ''
	};

	const contactToast: ToastSettings = {
		message: '👍 Danke für Ihre Rückmeldung!',
		timeout: 3000
	};

	function onFormSubmit(): void {
		if ($modalStore[0].response) $modalStore[0].response(formData);
		modalStore.close();
		toastStore.trigger(contactToast);
	}
</script>

{#if $modalStore[0]}
	<div class="card p-4 w-modal shadow-xl space-y-4">
		<header class="text-2xl font-bold">Kontakt</header>
		<article>Senden Sie uns eine Nachricht</article>
		<form class="modal-form border border-surface-500 p-4 space-y-4 rounded-container-token">
			<label class="label">
				<span>Betreff</span>
				<input class="input" type="text" bind:value={formData.subject} placeholder="Betreff" />
			</label>
			<p>Email (Optional)</p>
			<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
				<div class="input-group-shim">
					<span class="material-symbols-outlined">mail</span>
				</div>
				<input type="text" bind:value={formData.email} placeholder="name@email.at" />
			</div>
			<label class="label">
				<span>Nachricht</span>
				<textarea
					class="textarea"
					rows="8"
					bind:value={formData.message}
					placeholder="Ihre Nachricht hier."
				/>
			</label>
			<form />
			<!-- prettier-ignore -->
			<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral} hover:variant-soft-primary" on:click={parent.onClose}>Abbrechen</button>
			<button class="btn variant-outline-primary hover:variant-filled-primary" on:click={onFormSubmit}>Nachricht senden</button>
		</footer>
		</form>
	</div>
{/if}
