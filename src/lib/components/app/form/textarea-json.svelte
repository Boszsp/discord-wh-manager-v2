<script lang="ts">
	import { DEFAULT_WEBHOOK_CONTENT_AS_STRING } from '$lib/default';
	import { cn } from '$lib/utils';
	import { highlightCode } from '$lib/utilsFn/string';
	import type { ClassValue } from 'svelte/elements';
	import "./textarea-json.css";

	let {
		value = $bindable(DEFAULT_WEBHOOK_CONTENT_AS_STRING),
		class: className
	}: { value?: string; class?: ClassValue } = $props();

    let oldVal = ""

    
</script>

<div class={cn('relative flex-1 rounded-md bg-[rgb(34,39,46)] p-4 h-fit w-full overflow-hidden text-wrap break-all min-h-16 textarea-json ', className)}>
	<div >
		{#await highlightCode(value, 'json')}
			{@html oldVal}
		{:then res}
            <p hidden class="hidden">{oldVal = res && ""}</p>
			{@html res}
			{#if value.endsWith('\n')}
				<br />
			{/if}
        {:catch e}
			{@debug e}
            {@html oldVal}
		{/await}
	</div>

	<textarea
		class="absolute inset-0 h-full w-full resize-none overflow-hidden border-none bg-transparent p-4 font-mono text-foreground/20 focus:outline-none"
		bind:value
	></textarea>
</div>

