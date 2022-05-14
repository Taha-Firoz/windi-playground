<script>
	import Draggable from '../lib/Draggable.svelte';
	import { clickOutside, resize } from '../lib/utils';
	import { generateStyles } from '../lib/windirunner';
	import Layout from './__layout.svelte';

	const default_element = ['div', 'bg-blue-500 rounded w-1/5 h-80 hover:bg-red-400'];
	let elements = [[...default_element]];
	let dyStyle = null;
	let disable_drag = false;
	let editable_selected = null;

	let className = '';
	let elementType = '';
	let clone = false;

    let show_info = false
	function updateStyle() {
		if (editable_selected !== null) {
			// reassign the elements array with the new style
			elements[editable_selected][0] = elementType;
			elements[editable_selected][1] = className;
		}
		let styles = generateStyles(elements.map((e) => e[1]).join(' '));
		if (dyStyle === null) {
			dyStyle = document.createElement('style');
			dyStyle.type = 'text/css';
			dyStyle.innerHTML = styles;
			document.getElementsByTagName('head')[0].appendChild(dyStyle);
		}
		dyStyle.innerHTML = styles;
	}
</script>

<span class="z-20 absolute bottom-0 right-0 flex flex-col">
    {#if show_info}
	<div use:clickOutside on:click_outside={()=>{show_info = false}} class="text-white rounded-lg mb-4 mr-4 bg-cool-gray-500 bg-opacity-60 p-6 min-h-50 max-w-70 border border-transparent hover:border-white shadow-lg">
		Hi 😅 this is just a random website I made that 3 AM to test windi-css out and do quick experiments.
        Look around and try some stuff
	</div>
        
    {/if}
	<span class="flex justify-end text-xl">
		<button
			on:click={() => {
				elements = [[...default_element]];
				dyStyle = null;
				disable_drag = false;
				editable_selected = null;

				className = '';
				elementType = '';
				clone = false;
                show_info = false;
			}}
			class=" h-10 w-10 rounded-lg border-transparent mb-4 mr-4 bg-cool-gray-500 bg-opacity-40 hover:bg-opacity-60 hover:text-white hover:text-opacity-40 !active:text-opacity-100 border active:border-white"
		>
			⭯
		</button>
		<button
            on:click={() => {
                show_info = !show_info
            }}
			class="h-10 w-10 rounded-lg border-transparent mb-4 mr-4 bg-cool-gray-500 bg-opacity-40 hover:bg-opacity-60 hover:text-white hover:text-opacity-40 !active:text-opacity-100 border active:border-white"
		>
			?
		</button>

        <a href="https://github.com" aria-label="Homepage" class="flex justify-center items-center h-10 w-10 rounded-lg border-transparent mb-4 mr-4 bg-cool-gray-500 opacity-40 hover:bg-opacity-60 hover:fill-white hover:opacity-60 !active:opacity-100 border active:border-white" title="GitHub">
            <svg aria-hidden="true" class="h-8 w-8 " version="1.1" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
      </svg>
      </a>
	</span>
</span>
{#if editable_selected !== null}
	<Draggable disabled={disable_drag}>
		<div class="flex flex-col text-lg font-bold text-cool-gray-500 px-8 py-8 min-w-100">
			<span class="flex mb-6 justify-between h-10">
				<span class="text-2xl align-middle">Tailwind Editor</span>
				<button
					on:click={() => (editable_selected = null)}
					class="w-10 h-10 bg-gray-400 text-center rounded-xl font-bold text-white hover:bg-opacity-80 active:bg-gray-600"
				>
					x
				</button>
			</span>
			<div class="flex flex-col space-y-6">
				<div class="flex flex-col">
					<span>Classes</span>
					<textarea
						bind:value={className}
						on:resize={() => {
							disable_drag = true;
						}}
						use:resize
						on:input={updateStyle}
						use:clickOutside
						on:click_outside={() => (disable_drag = false)}
						on:focus={() => (disable_drag = true)}
						class="min-w-100 resize text-gray-600 font-semibold px-4 py-2 outline-none border-gray-400 border rounded-lg focus:border-blue-400"
						placeholder="Enter some classes"
					/>
				</div>
				<div class="flex flex-col">
					<span>Type</span>
					<select
						bind:value={elementType}
						on:change={updateStyle}
						class=" font-semibold bg-white p-4 rounded-md text-gray-600 border-gray-400 border rounded-lg focus:border-blue-400"
					>
						<option value="">nothing selected</option>
						<option value="div">div</option>
						<option value="input">input</option>
						<option value="textarea">textarea</option>
						<option value="button">button</option>
					</select>
				</div>
				<div class="flex flex-col">
					<span>Clone</span>
					<input class="w-4 h-4" bind:checked={clone} type="checkbox" />
				</div>
				<span class="flex justify-evenly">
					<button
						on:click={() => {
							elements.splice(editable_selected === 0 ? 0 : editable_selected, 0, [
								...(!clone ? default_element : [elementType, className])
							]);
							elements = [...elements];
						}}
						class="h-15 w-15 bg-blue-500 text-white text-center text-2xl rounded-xl hover:bg-opacity-90 active:bg-blue-600"
					>
						↑ +
					</button>
					<button
						on:click={() => {
							elements.splice(editable_selected, 0, [
								...(!clone ? default_element : [elementType, className])
							]);
							elements = [...elements];
						}}
						class="h-15 w-15 bg-blue-500 text-white text-center text-2xl rounded-xl hover:bg-opacity-90 active:bg-blue-600"
					>
						+
					</button>
					<button
						on:click={() => {
							elements.splice(editable_selected, 0, [
								...(!clone ? default_element : [elementType, className])
							]);
							elements = [...elements];
						}}
						class="h-15 w-15 bg-blue-500 text-white text-center text-2xl rounded-xl hover:bg-opacity-90 active:bg-blue-600"
					>
						+ ↓
					</button>
				</span>

				<span class="flex justify-evenly space-x-20">
					<button
						on:click={() => {
							elements = elements.filter((_, idx) => idx !== editable_selected);
							editable_selected = null;
						}}
						class="h-15 w-full bg-blue-500 text-white text-center text-xl rounded-xl hover:bg-opacity-90 active:bg-blue-600"
					>
						delete element
					</button>
					<button
						on:click={() => {
							elements = [[...default_element]];
						}}
						class="h-15 w-full bg-blue-500 text-white text-center text-xl rounded-xl hover:bg-opacity-90 active:bg-blue-600"
					>
						reset
					</button>
				</span>
			</div>
		</div>
	</Draggable>
{/if}

<div class="z-0 h-screen flex flex-col justify-center items-center bg-gray-800 dots overflow-auto">
	{#each elements as [tag, classes], index}
		<svelte:element
			this={tag}
			class={classes}
			on:click={(e) => {
				clone = false;
				editable_selected = index;
				className = classes;
				elementType = tag;
			}}
		/>
	{/each}
</div>
