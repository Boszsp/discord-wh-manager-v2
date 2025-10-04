<script lang="ts">
	import { Card } from '$lib/components/ui/card';
	import type { embedsSchemaType } from '$lib/schema/webhookContentSchema';
	import { cn } from '$lib/utils';

	const {
		embed
	}: {
		embed?: embedsSchemaType;
	} = $props();
</script>

<Card class="relative gap-2 overflow-hidden rounded-sm p-4 text-sm">
	<div class="absolute top-0 left-0 h-full w-1 bg-primary"></div>
	{#if embed?.author.name}
		<div class="text-sm font-bold">
			{#if embed?.author.url}
				<a href={embed?.author.url} class="text-blue-400">
					{embed?.author.name}
				</a>
			{:else}
				<span>{embed?.author.name}</span>
			{/if}
		</div>
	{/if}
	{#if embed?.title || embed?.description}
		<div>
			<a href={embed?.url} class="text-blue-400">
				<div class="text-base font-semibold">{embed?.title}</div>
			</a>
			<div>{embed?.description}</div>
		</div>
	{/if}
	{#if embed?.fields}
		<div>
			{#each embed?.fields as field, i (field.name + i)}
				<div
					class={cn(
						field?.inline ? 'inline-block' : '',
						i < embed?.fields.length && embed?.fields[i + 1]?.inline && 'mr-2'
					)}
				>
					<div class="font-bold">{field?.name}</div>
					<p>{field?.value}</p>
				</div>
			{/each}
		</div>
	{/if}
</Card>
