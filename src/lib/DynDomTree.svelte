<script>
import { currentPath } from "../stores";

import { createEventDispatcher } from "svelte";
import { childrenIdx, classIdx, tagIdx } from "$lib/utils";


    
	const dispatch = createEventDispatcher();

    /**
     * @type {number[]} idx
     */
    export let idx
    
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

</script>


{#if children.length === 0}
    <svelte:element
        this={tag}
        class={classes}
        on:click|stopPropagation={()=>{currentPath.set(idx)}}
    />
{:else}
    <svelte:element
    this={tag}
    class={classes}
    on:click|stopPropagation={()=>{currentPath.set(idx)}}
    >
    {#each children as child, index}
        <svelte:self tag={child[tagIdx]} idx={[...idx, index]} classes={child[classIdx]} children={child.length===2?[]:child[childrenIdx]}/>
    {/each}
</svelte:element>

{/if}