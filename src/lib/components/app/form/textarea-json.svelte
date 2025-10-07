<script lang="ts">
	import { DEFAULT_WEBHOOK_CONTENT_AS_STRING } from '$lib/default';
	import { cn, type WithElementRef, type WithoutChildren } from '$lib/utils';
	import { highlightCode } from '$lib/utilsFn/string';
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import './textarea-json.css';

	let {
		value = $bindable(DEFAULT_WEBHOOK_CONTENT_AS_STRING),
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithoutChildren<WithElementRef<HTMLTextareaAttributes>> & {value:string} = $props();

	let oldVal = '';
</script>

<div
	class={cn(
		'textarea-json relative h-fit min-h-16 w-full flex-1 overflow-hidden rounded-md bg-[rgb(34,39,46)] p-4 text-wrap break-all ',
		className
	)}
>
	<div>
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

	<textarea
		class="absolute inset-0 h-full w-full resize-none overflow-hidden border-none bg-transparent p-4 font-mono text-foreground/20 focus:outline-none"
		bind:value
		{...restProps}
	></textarea>
</div>
