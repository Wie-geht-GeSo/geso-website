<script lang="ts">
	import type { PopupBlock } from '$lib/types/blocks/PopupBlock';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';

	const popupClick: PopupSettings = {
		event: 'click',
		target: 'popupClick',
		placement: 'bottom'
	};

	export let data: PopupBlock;
</script>

<div class="py-5">
    <button class="btn variant-outline self-start" use:popup={popupClick}>
        {#if data.icon}
            <span class="material-symbols-outlined">{data.icon}</span>
        {/if}
        <span>{data.title}</span>
    </button>
    
    <div class="card variant-glass-primary p-4 overflow-auto break-words break-all whitespace-normal" data-popup="popupClick">
        {@html data.content}
    </div>
</div>
