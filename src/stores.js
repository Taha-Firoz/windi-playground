import { writable } from 'svelte/store';

/** @type {import('svelte/store').Writable<number []| null>} currentPath*/
export const currentPath = writable(null);