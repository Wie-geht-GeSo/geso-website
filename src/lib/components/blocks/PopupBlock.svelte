<script lang="ts">
	import type { PopupBlock } from '$lib/types/blocks/PopupBlock';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';

	export let data: PopupBlock;
    let target = 'popupTarget' + Math.random().toString(36).substring(7);
    const popupSettings: PopupSettings = {
		event: 'click',
		target: target,
		placement: 'bottom'
	};

</script>

<div class="py-5">
    <button class="btn variant-outline self-start" use:popup={popupSettings}>
        {#if data.icon}
            <span class="material-symbols-outlined">{data.icon}</span>
        {/if}
        <span>{data.title}</span>
    </button>
    
    
    <div class="card variant-glass-primary p-4 overflow-auto break-words break-all whitespace-normal" data-popup="{target}">
        {@html data.content}
    </div>
</div>
