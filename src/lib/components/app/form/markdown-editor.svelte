<script lang="ts">
	import { Carta, MarkdownEditor } from 'carta-md';
	import 'carta-md/default.css'; /* Default theme */
	import { code } from '@cartamd/plugin-code';
	import { emoji } from '@cartamd/plugin-emoji';
	import '@cartamd/plugin-emoji/default.css';
	import '@cartamd/plugin-code/default.css';
	import './markdown-editor.css';
	import type { ClassValue } from 'svelte/elements';
	import { cn } from '$lib/utils';
	import { sanitize } from '$lib/utilsFn/md';
	const carta = new Carta({
		sanitizer: sanitize,
		extensions: [code({ theme: 'github-dark' }), emoji()]
	});

    let {value = $bindable(""),class:className}:{value:string,class?:ClassValue} = $props();
    
</script>

<div class={cn("overflow-hidden rounded-md border border-input bg-input/30",className)}>
	<MarkdownEditor {carta} bind:value theme="github-dark" />
</div>

<style>
	/* Set your monospace font  */
	/* Required to have the editor working correctly! */
	:global(.carta-font-code) {
        font-size:var(--text-sm);
        font-family: var(--default-font-family);
		line-height: 1.1rem;
		letter-spacing: normal;
	}
</style>
