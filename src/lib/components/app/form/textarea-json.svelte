<script lang="ts">
	import { DEFAULT_WEBHOOK_CONTENT_AS_STRING } from '$lib/default';
	import { cn } from '$lib/utils';
	import { highlightCode } from '$lib/utilsFn/string';
	import type { ClassValue } from 'svelte/elements';

	let {
		value = $bindable(DEFAULT_WEBHOOK_CONTENT_AS_STRING),
		class: className
	}: { value?: string; class?: ClassValue } = $props();

    let oldVal = ""

    
</script>

<div class={cn('relative flex-1 rounded-md bg-[rgb(34,39,46)] p-4 h-fit min-h-16 ', className)}>
	<div >
		{#await highlightCode(value, 'json')}
			{@html oldVal}
		{:then res}
            <p hidden class="hidden">{oldVal = res}</p>
			{@html res}
			{#if value.endsWith('\n')}
				<br />
			{/if}
        {:catch e}
            {@html oldVal}
		{/await}
	</div>

	<textarea
		class="absolute inset-0 h-full w-full resize-none overflow-hidden border-none bg-transparent p-4 font-mono text-foreground/20 focus:outline-none"
		bind:value
	></textarea>
</div>
