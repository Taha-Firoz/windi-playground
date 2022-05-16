<script>
	import Draggable from '$lib/Draggable.svelte';
	import DynDomTree from '$lib/DynDomTree.svelte';
	import { childrenIdx, classIdx, clickOutside, imageIdx, htmlTags, resize, tagIdx } from '$lib/utils';
	import { generateStyles } from '$lib/windirunner';
	import { onMount } from 'svelte';
	import { currentPath } from '../stores';


	/**
	 * @type {[string, string, string]}
	 */
	const default_reset = ['div', 'bg-blue-500 rounded w-1/5 h-80 hover:bg-red-400', '']

	/**
	 * @type {[string, string, string ]}
	 */
	let default_element = default_reset;

	/**
	 * @type {[import('$lib/utils').treeNode]}
	 */
	let elements = [[...default_element, []]];
	/**
	 * @type {HTMLStyleElement|null}
	 */
	let dyStyle = null;
	let disable_drag = false;

	/**
	 * @type {number[] | null}
	 */
	let elementPath = null;
	/**
	 * @type {import('$lib/utils').treeNode | null}
	 */
	let element = null;
	/**
	 * @type {number | null}
	 */
	let elementIdx = null;
	/**
	 * @type {import('$lib/utils').treeNode | null}
	 */
	let parent = null;

	let className = '';
	let elementType = '';
	let imageUrl = '';
	let clone = false;

	let showDropDown = false;
	let showInfo = false;
	let showDefault = false;

	onMount(() => {
		return currentPath.subscribe((path) => {
			if (path != null) {
				elementPath = path;
				getElement();
			}
		});
	});

	function getElement() {
		if (elementPath === null) return;
		parent = null;
		element = null;
		elementIdx = null;
		for (const idx of elementPath) {
			if (element === null) {
				element = elements[idx];
			} else {
				parent = element;
				element = element[childrenIdx][idx];
			}
			elementIdx = idx;
		}
		if (element === null) return;
		className = element[classIdx];
		elementType = element[tagIdx];
	}

	function setElement() {
		if (element != null) {
			element[tagIdx] = elementType;
			element[classIdx] = className;
			elements = [...elements];
		}
	}

	function setImageURL() {
		if (element != null) {
			console.log(imageUrl)
			element[imageIdx] = imageUrl;
			elements = [...elements];
		}
	}
	/**
	 * @param {'Above'|'Inside'|'Below'} position
	 */
	function addElement(position) {
		/** @type {import('$lib/utils').treeNode}
		**/
		let newNode
		if (clone === false){
			newNode = [...default_element, []]
		}else{
			if(elementType === "div"){
				newNode = [elementType, className, imageUrl, []]
			}else{
				newNode = [elementType, className, '', []]
			}
		}
		if (position === 'Above' && parent != null && elementIdx != null) {
			parent[childrenIdx].splice(elementIdx, 0, newNode);
		} else if (position === 'Inside' && element != null) {
			console.log(JSON.stringify(element))
			element[childrenIdx].push(newNode);
			console.log(JSON.stringify(element))

		} else if (position === 'Below' && elementIdx != null && parent != null) {
			parent[childrenIdx].splice(elementIdx + 1, 0, newNode);
		}
		elements = [...elements];
	}
	function updateStyle() {
		if (elementPath !== null) {
			setElement();
		}
		const flattened = elements.flat(30);
		let styles = generateStyles(flattened.filter((e) => !htmlTags.includes(e)).join(' '));
		if (dyStyle === null) {
			dyStyle = document.createElement('style');
			dyStyle.innerHTML = styles;
			document.getElementsByTagName('head')[tagIdx].appendChild(dyStyle);
		}
		dyStyle.innerHTML = styles;
	}
</script>

<span class="z-20 absolute bottom-0 right-0 flex flex-col">
	<!-- About the page -->
	{#if showInfo}
		<div
			use:clickOutside
			on:click_outside={() => {
				showInfo = false;
			}}
			class="text-white rounded-lg mb-4 mr-4 bg-cool-gray-500 bg-opacity-60 p-6 min-h-50 max-w-70 border border-transparent hover:border-white shadow-lg"
		>
			Hi 😅 this is just a random website I made that 3 AM to quickly test WindiCSS out.
			Its primarily meant to be an introduction and training tool for new devs.
			Look around and try some stuff, if you have any changes in feel free to open a PR!

			Yes there aren't any instructions here rn, but you'll eventually find them in the README.md file.
		</div>
	{/if}


	<!-- Default element editor -->
	{#if showDefault}
		<div
			use:clickOutside
			on:click_outside={() => {
				showDefault = false;
			}}
			class="text-white rounded-lg mb-4 mr-4 bg-cool-gray-500 bg-opacity-60 p-6 min-h-50 min-w-70 border border-transparent hover:border-white shadow-lg flex flex-col"
		>
			<div class="flex flex-col space-y-6">
				<div class="flex flex-col">
					<span>Classes</span>
					<textarea
						bind:value={default_element[classIdx]}
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
						bind:value={default_element[tagIdx]}
						on:change={updateStyle}
						class=" font-semibold bg-white p-4 rounded-md text-gray-600 border-gray-400 border rounded-lg focus:border-blue-400"
					>
						{#each htmlTags as tag}
							<option value={tag}>{tag}</option>
						{/each}
					</select>
				</div>
			</div>
		</div>
	{/if}

	<!-- Footer Bar -->

	<span class="flex justify-end text-xl">
		<a title="WindiCSS" target="_blank" href="https://windicss.org" class="flex justify-center items-center h-10 w-10 rounded-lg border-transparent mb-4 mr-4 bg-cool-gray-500 opacity-40 hover:bg-opacity-60 hover:fill-white hover:opacity-60 !active:opacity-100 border active:border-white">
			<img class="p-2" src="https://windicss.org/assets/logo.svg" alt="WindiCSS url"/>    
		</a>
		<button
			title="Default Element"
			on:click={() => {
				showDefault = !showDefault;
			}}
			class="h-10 w-10 rounded-lg border-transparent mb-4 mr-4 bg-cool-gray-500 bg-opacity-40 hover:bg-opacity-60 hover:text-white hover:text-opacity-40 !active:text-opacity-100 border active:border-white">
			<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" class="p-2" preserveAspectRatio="xMidYMid meet" viewBox="0 0 36 36"><path fill="currentColor" d="M18.1 11c-3.9 0-7 3.1-7 7s3.1 7 7 7s7-3.1 7-7s-3.1-7-7-7zm0 12c-2.8 0-5-2.2-5-5s2.2-5 5-5s5 2.2 5 5s-2.2 5-5 5z" class="clr-i-outline clr-i-outline-path-1"/><path fill="currentColor" d="m32.8 14.7l-2.8-.9l-.6-1.5l1.4-2.6c.3-.6.2-1.4-.3-1.9l-2.4-2.4c-.5-.5-1.3-.6-1.9-.3l-2.6 1.4l-1.5-.6l-.9-2.8C21 2.5 20.4 2 19.7 2h-3.4c-.7 0-1.3.5-1.4 1.2L14 6c-.6.1-1.1.3-1.6.6L9.8 5.2c-.6-.3-1.4-.2-1.9.3L5.5 7.9c-.5.5-.6 1.3-.3 1.9l1.3 2.5c-.2.5-.4 1.1-.6 1.6l-2.8.9c-.6.2-1.1.8-1.1 1.5v3.4c0 .7.5 1.3 1.2 1.5l2.8.9l.6 1.5l-1.4 2.6c-.3.6-.2 1.4.3 1.9l2.4 2.4c.5.5 1.3.6 1.9.3l2.6-1.4l1.5.6l.9 2.9c.2.6.8 1.1 1.5 1.1h3.4c.7 0 1.3-.5 1.5-1.1l.9-2.9l1.5-.6l2.6 1.4c.6.3 1.4.2 1.9-.3l2.4-2.4c.5-.5.6-1.3.3-1.9l-1.4-2.6l.6-1.5l2.9-.9c.6-.2 1.1-.8 1.1-1.5v-3.4c0-.7-.5-1.4-1.2-1.6zm-.8 4.7l-3.6 1.1l-.1.5l-.9 2.1l-.3.5l1.8 3.3l-2 2l-3.3-1.8l-.5.3c-.7.4-1.4.7-2.1.9l-.5.1l-1.1 3.6h-2.8l-1.1-3.6l-.5-.1l-2.1-.9l-.5-.3l-3.3 1.8l-2-2l1.8-3.3l-.3-.5c-.4-.7-.7-1.4-.9-2.1l-.1-.5L4 19.4v-2.8l3.4-1l.2-.5c.2-.8.5-1.5.9-2.2l.3-.5l-1.7-3.3l2-2l3.2 1.8l.5-.3c.7-.4 1.4-.7 2.2-.9l.5-.2L16.6 4h2.8l1.1 3.5l.5.2c.7.2 1.4.5 2.1.9l.5.3l3.3-1.8l2 2l-1.8 3.3l.3.5c.4.7.7 1.4.9 2.1l.1.5l3.6 1.1v2.8z" class="clr-i-outline clr-i-outline-path-2"/><path fill="none" d="M0 0h36v36H0z"/></svg>
		</button>

		<button
			title="Reset Everything"
			on:click={() => {
				default_element = default_reset;
				elements = [[...default_element, []]];
				dyStyle = null;
				disable_drag = false;
				elementPath = null;
				elementIdx = null;
				parent = null;
				className = '';
				elementType = '';
				clone = false;
				showDropDown = false;
				showInfo = false;
				showDefault = false;
			}}
			class=" h-10 w-10 rounded-lg border-transparent mb-4 mr-4 bg-cool-gray-500 bg-opacity-40 hover:bg-opacity-60 hover:text-white hover:text-opacity-40 !active:text-opacity-100 border active:border-white">
			⭯
		</button>
		<button
			title="About"
			on:click={() => {
				showInfo = !showInfo;
			}}
			class="h-10 w-10 rounded-lg border-transparent mb-4 mr-4 bg-cool-gray-500 bg-opacity-40 hover:bg-opacity-60 hover:text-white hover:text-opacity-40 !active:text-opacity-100 border active:border-white">
			?
		</button>

		<a
			target="_blank"
			href="https://github.com/taha-firoz/windi-playground"
			aria-label="Homepage"
			class="flex justify-center items-center h-10 w-10 rounded-lg border-transparent mb-4 mr-4 bg-cool-gray-500 opacity-40 hover:bg-opacity-60 hover:fill-white hover:opacity-60 !active:opacity-100 border active:border-white"
			title="GitHub Source"
		>
			<svg aria-hidden="true" class="p-2" version="1.1" viewBox="0 0 16 16"
				><path
					fill-rule="evenodd"
					d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
				/>
			</svg>
		</a>
	</span>
</span>


<!-- Floating CSS Editor Window -->
{#if elementPath !== null}
	<Draggable disabled={disable_drag}>
		<div class="flex flex-col text-lg font-bold text-cool-gray-500 px-8 py-8 min-w-100">
			<span class="flex mb-6 justify-between h-10">
				<span class="text-2xl align-middle">Windi Editor</span>
				<button
					on:click={() => (elementPath = null)}
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
						{#each htmlTags as tag}
							<option value={tag}>{tag}</option>
						{/each}
					</select>
				</div>
				<div class="flex flex-col">
					<span>Clone</span>
					<input class="w-4 h-4" bind:checked={clone} type="checkbox" />
				</div>
				{#if elementType === "div"}
					<div class="flex flex-col">
						<span>Image URL</span>
						<input class="p-4 bg-white rounded-lg border border-gray-400 focus:border-blue-400" on:input={setImageURL} bind:value={imageUrl} type="text"/>
					</div>
				{/if}
				<span class="flex justify-between items-center">
					<span class="flex space-x-4">
						<button
							disabled={parent === null}
							on:click={() => addElement('Above')}
							class="h-15 w-15 bg-blue-500 text-white text-center text-2xl disabled:bg-gray-400 rounded-xl hover:bg-opacity-90 active:bg-blue-600"
						>
							↑ +
						</button>
						<button
							on:click={() => {
								addElement('Inside');
							}}
							class="h-15 w-15 bg-blue-500 text-white text-center text-2xl rounded-xl hover:bg-opacity-90 active:bg-blue-600"
						>
							+
						</button>
						<button
							disabled={parent === null}
							on:click={() => {
								addElement('Below');
							}}
							class="h-15 w-15 bg-blue-500 text-white text-center text-2xl rounded-xl disabled:bg-gray-400 hover:bg-opacity-90 active:bg-blue-600"
						>
							+ ↓
						</button>
					</span>
					<span class="flex flex-col justify-center relative inline-block p-2">
						<button
							on:click={() => {
								showDropDown = !showDropDown;
							}}
							class="w-15 h-15 hover:bg-gray-300 rounded-full active:bg-gray-400"
						>
							⋮
						</button>
						{#if showDropDown}
							<span
								use:clickOutside
								on:click_outside={() => {
									showDropDown = false;
								}}
								class="absolute right-0 top-0 min-h-20 w-40 bg-cool-gray-200 border border-gray-400 shadow-2xl rounded-lg flex flex-col py-4"
							>
								<button
									disabled={parent === null}
									on:click={() => {
										showDropDown = false;
										if (parent != null) {
											parent[childrenIdx] = [
												...parent[childrenIdx].filter((element, index) => index !== elementIdx)
											];
										}
										elements = [...elements];
										elementPath = null;
									}}
									class="disabled:bg-cool-gray-200 disabled:cursor-not-allowed hover:bg-gray-400 active:bg-blue-600 p-4 w-full "
								>
									delete element
								</button>
								<span class="w-full h-2 border-b-2 border-gray-400 mb-2" />
								<button
									on:click={() => {
										if (element != null) {
											elementType = element[tagIdx] = default_element[tagIdx];
											className = element[classIdx] = default_element[classIdx];
											elements = [...elements];
										}
									}}
									class="hover:bg-gray-400 active:bg-blue-600 p-4 w-full "
								>
									reset
								</button>
							</span>
						{/if}
					</span>
				</span>
			</div>
		</div>
	</Draggable>
{/if}


<!-- Render elements -->
<div class="z-0 h-screen flex flex-col justify-center items-center bg-gray-800 dots overflow-auto">
	<DynDomTree
		idx={[tagIdx]}
		image_url={elements[tagIdx][imageIdx]}
		tag={elements[tagIdx][tagIdx]}
		classes={elements[tagIdx][classIdx]}
		children={elements[tagIdx][childrenIdx]}
	/>
</div>
