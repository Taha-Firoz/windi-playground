<script>
import { currentPath } from "../stores";

import { createEventDispatcher } from "svelte";
import { childrenIdx, classIdx, imageIdx, tagIdx } from "$lib/utils";


    
	const dispatch = createEventDispatcher();

    /**
     * @type {number[]} idx
     */
    export let idx

    /**
     * @type {string} image_url
     */
     export let image_url
    
    /**
     * @type {string} tag
     */
    export let tag
    /**
     * @type {string} classes
     */
    export let classes

    /**
     * @type {import('$lib/utils').treeNode[]} children
     */
    export let children = []

    console.log(children)

</script>


{#if children.length === 0}
{#if image_url !== ''}
        <svelte:element
            style={`background-image: url(${image_url})`}
            this={tag}
            class={classes}
            on:click|stopPropagation={()=>{currentPath.set(idx)}}
        />
    {:else}
        <svelte:element
            this={tag}
            class={classes}
            on:click|stopPropagation={()=>{currentPath.set(idx)}}
        />
    {/if}
{:else}
    <svelte:element
    this={tag}
    class={classes}
    on:click|stopPropagation={()=>{currentPath.set(idx)}}
    >
    {#each children as child, index}
        <svelte:self tag={child[tagIdx]} image_url={child[imageIdx]} idx={[...idx, index]} classes={child[classIdx]} children={child[childrenIdx]}/>
    {/each}
</svelte:element>

{/if}