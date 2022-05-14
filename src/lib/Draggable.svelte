<script>
	export let left = 100;
	export let top = 100;
	export let disabled = false
	/**
	 * 
	 * @type {Touch|null} 
	 */
	export let previousTouch = null;
    
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
	/**
	 * 
	 * @param {TouchEvent} e
	 */
	function onTouchMove(e) {
		if (moving && previousTouch) {
			// be aware that these only store the movement of the first touch in the touches array
			left += e.touches[0].pageX - previousTouch.pageX;
			top += e.touches[0].pageY - previousTouch.pageY;
		}
		previousTouch = e.touches[0];
	}
	
	function onMouseUp() {
		moving = false;
		previousTouch = null;
	}
	
</script>

<section id="ignored" on:mousedown={onMouseDown} on:touchstart={onMouseDown} class="z-100 bg-cool-gray-200 absolute active:cursor-pointer select-none rounded-2xl border border-cool-gray-300 active:border-cool-gray-400 " style="left: {left}px; top: {top}px;">
	<slot></slot>
</section>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} on:touchend={onMouseUp} on:touchcancel={onMouseUp} on:touchmove={onTouchMove} />