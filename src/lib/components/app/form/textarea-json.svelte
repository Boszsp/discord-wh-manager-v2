<script lang="ts">
	import { DEFAULT_WEBHOOK_CONTENT_AS_STRING } from '$lib/default';
	import { highlightCode } from '$lib/utilsFn/string';

	let { value=$bindable(DEFAULT_WEBHOOK_CONTENT_AS_STRING) }: { value: string } = $props();
</script>

{#await highlightCode(value, 'json')}
	<p class="text-transparent">Processing...</p>
{:then res}
	{@html res}
{/await}

<textarea
	class="absolute inset-0 h-full w-full resize-none border-none bg-transparent p-4 font-mono text-foreground/20 focus:outline-none"
	bind:value={value}
></textarea>
