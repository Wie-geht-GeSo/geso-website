<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Page } from '$lib/types/Page';
	import { onMount } from 'svelte';

	export let page: Page;

	const localStorageKeyLike = `liked-${page.id}`;
	const localStorageKeyDislike = `disliked-${page.id}`;
	let userLiked: string | null;
	let userDisliked: string | null;

	onMount(() => {
		userLiked = localStorage.getItem(localStorageKeyLike);
		userDisliked = localStorage.getItem(localStorageKeyDislike);
	});

	function handleSubmit(choice: 'like' | 'dislike', cancel: () => void) {
		if (
			(choice === 'like' && userLiked === 'true') ||
			(choice === 'dislike' && userDisliked === 'true')
		) {
			cancel();
		} else {
			if (choice === 'like') {
				localStorage.setItem(localStorageKeyLike, 'true');
				localStorage.removeItem(localStorageKeyDislike);
				userLiked = 'true';
				userDisliked = null;
			} else {
				localStorage.setItem(localStorageKeyDislike, 'true');
				localStorage.removeItem(localStorageKeyLike);
				userLiked = null;
				userDisliked = 'true';
			}
		}
	}
</script>

<div class="flex flex-col items-center pt-10 text-center">
	<p class="text-base md:text-lg font-semibold pb-2">
		Haben Sie die passende Information gefunden?
	</p>
	<div class="flex items-center space-x-4 mt-2">
		<form
			method="POST"
			action="?/like"
			use:enhance={({ cancel }) => {
				return handleSubmit('like', cancel);
			}}
		>
			<input type="hidden" name="pageId" value={page.id} />
            <input type="hidden" name="previousAction" value={userDisliked ? 'true' : ''} />
			<button
				class="btn hover:variant-filled-success {userLiked
					? 'variant-filled-success'
					: 'variant-ringed-success'}"
			>
				<span class="material-symbols-outlined">thumb_up</span>
				<span>Ja</span>
			</button>
		</form>
		<form
			method="POST"
			action="?/dislike"
			use:enhance={({ cancel }) => {
				return handleSubmit('dislike', cancel);
			}}
		>
			<input type="hidden" name="pageId" value={page.id} />
            <input type="hidden" name="previousAction" value={userLiked ? 'true' : ''} />
			<button
				class="btn hover:variant-filled-error {userDisliked
					? 'variant-filled-error'
					: 'variant-outline-error'}"
			>
				<span class="material-symbols-outlined">thumb_down</span>
				<span>Nein</span>
			</button>
		</form>
	</div>
</div>
