<script lang="ts">
	import type { PopupBlock } from '$lib/types/blocks/PopupBlock';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';

	export let data: PopupBlock;
	$: popUp = data?.popup;
	
	let target = 'popupTarget' + Math.random().toString(36).substring(7);
	const popupSettings: PopupSettings = {
		event: 'click',
		target: target,
		placement: 'bottom'
	};
</script>

{#if popUp && popUp.title && popUp.content}
	<div class="py-5">
		<button class="btn variant-outline self-start" use:popup={popupSettings}>
			{#if popUp.icon}
				<span class="material-symbols-outlined">{popUp.icon}</span>
			{/if}
			<span>{popUp.title}</span>
		</button>

		<div
			class="card variant-glass-primary p-4 overflow-auto break-words break-all whitespace-normal"
			data-popup={target}
		>
			{@html popUp.content}
		</div>
	</div>
{/if}
