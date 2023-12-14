<script lang="ts">
	let zoomLevel = 1;
	const maxZoomLevel = 1.4;
	const minZoomLevel = 1;

	function zoomIn() {
		if (zoomLevel < maxZoomLevel) {
			zoomLevel += 0.1;
			document.documentElement.style.fontSize = zoomLevel + 'em';
		}
	}

	function zoomOut() {
		if (zoomLevel > minZoomLevel) {
			zoomLevel -= 0.1;
			document.documentElement.style.fontSize = zoomLevel + 'em';
		}
	}
</script>

<button
	class="btn btn-icon-sm hidden sm:flex variant-filled"
	on:click={zoomIn}
	title="Schrift größer"
	aria-label="Hineinzoomen"
>
	<span class="material-symbols-outlined">add</span>
</button>
<button
	class="btn btn-icon-sm hidden sm:flex variant-filled"
	on:click={zoomOut}
	title="Schrift kleiner"
	aria-label="Herauszoomen"
>
	<span class="material-symbols-outlined">remove</span>
</button>
