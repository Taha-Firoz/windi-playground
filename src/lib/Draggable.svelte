<script>
	export let left = 100;
	export let top = 100;
	export let disabled = false
    
	let moving = false;
	
	function onMouseDown() {
		moving = true;
	}
	
	function onMouseMove(e) {
		if (moving && !disabled) {
			left += e.movementX;
			top += e.movementY;
		}
	}
	
	function onMouseUp() {
		moving = false;
	}
	
</script>

<section id="ignored" on:mousedown={onMouseDown} class="bg-cool-gray-200 absolute active:cursor-pointer select-none rounded-2xl border border-cool-gray-300 active:border-cool-gray-400" style="left: {left}px; top: {top}px;">
	<slot></slot>
</section>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />