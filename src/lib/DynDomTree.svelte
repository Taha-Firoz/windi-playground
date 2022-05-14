<script>
import { currentPath } from "../stores";

import { createEventDispatcher } from "svelte";


    
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
        <svelte:self tag={child[0]} idx={[...idx, index]} classes={child[1]} children={child.length===2?[]:child[2]}/>
    {/each}
</svelte:element>

{/if}