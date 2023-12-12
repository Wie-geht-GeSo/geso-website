<script lang="ts">
	let zoomLevel = 1;
	const maxZoomLevel = 2;
	const minZoomLevel = 1;

	function zoomIn() {
		if (zoomLevel < maxZoomLevel) {
			zoomLevel += 0.2;
			(document.body.style as any).zoom = zoomLevel;
		}
	}

	function zoomOut() {
		if (zoomLevel > minZoomLevel) {
			zoomLevel -= 0.2;
			(document.body.style as any).zoom = zoomLevel;
		}
	}
</script>

<button class="btn btn-icon-sm hidden sm:flex variant-filled" on:click={zoomIn}>
	<span class="material-symbols-outlined">add</span>
</button>
<button class="btn btn-icon-sm hidden sm:flex variant-filled" on:click={zoomOut}>
	<span class="material-symbols-outlined">remove</span>
</button>
