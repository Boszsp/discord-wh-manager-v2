<script lang="ts">
	import { DEFAULT_WEBHOOK_CONTENT_AS_STRING } from '$lib/default';
	import { cn } from '$lib/utils';
	import { highlightCode } from '$lib/utilsFn/string';
	import type { ClassValue } from 'svelte/elements';
	import './preview-json.css';
	
	let { value = $bindable(DEFAULT_WEBHOOK_CONTENT_AS_STRING),class:className }: { value: string,class?:ClassValue } = $props();

	let oldVal = '';
</script>

<div class={cn("bg-[rgb(34,39,46)] rounded-md text-wrap preview-json",className)}>
	{#await highlightCode(value, 'json')}
		{@html oldVal}
	{:then res}
		<p hidden class="hidden">{(oldVal = res && '')}</p>
		{@html res}
		{#if value.endsWith('\n')}
			<br />
		{/if}
	{:catch e}
		{@debug e}
		{@html oldVal}
	{/await}
</div>
