<script lang="ts">
	import { Card } from '$lib/components/ui/card';
	import type { embedsSchemaType } from '$lib/schema/webhookContentSchema';
	import { toHex } from '$lib/utilsFn/string';
	import { cn } from '$lib/utils';

	const {
		embed
	}: {
		embed?: embedsSchemaType;
	} = $props();
</script>

<Card class="relative grid max-w-md w-full gap-2 overflow-hidden rounded-sm p-4 text-sm">
	<div
		class="absolute top-0 left-0 h-full w-1"
		style={`background-color: ${embed?.color ? toHex(embed.color) : 'var(--primary)'}`}
	></div>
    <div class="flex gap-6">
	<span>
		<div>
			{#if embed?.author?.name}
				<div class="flex items-center gap-2">
					{#if embed?.author.icon_url}
						<img
							src={embed?.author.icon_url}
							alt="author icon"
							class="h-6 w-6 rounded-full object-cover"
						/>
					{/if}
					<div class="text-sm font-bold">
						{#if embed?.author.url}
							<a href={embed?.author.url} class="text-blue-400">
								{embed?.author.name}
							</a>
						{:else}
							<span>{embed?.author.name}</span>
						{/if}
					</div>
				</div>
			{/if}
			{#if embed?.title || embed?.description}
				<div class="mt-2">
					{#if embed?.title}
						<a href={embed?.url} class="text-blue-400">
							<div class="text-base font-semibold">{embed?.title}</div>
						</a>
					{/if}
					{#if embed?.description}
						<div class="mt-1">{embed?.description}</div>
					{/if}
				</div>
			{/if}
		</div>

		{#if embed?.fields}
			<div class="grid grid-cols-3 gap-2">
				{#each embed?.fields as field, i (field.name + i)}
					<div class={cn(field?.inline ? 'inline-block' : 'col-span-3')}>
						<div class="font-bold">{field?.name}</div>
						<p>{field?.value}</p>
					</div>
				{/each}
			</div>
		{/if}
		{#if embed?.image?.url}
			<img src={embed?.image.url} alt="embed" class="mt-2 w-full rounded-md object-cover" />
		{/if}
		{#if embed?.footer?.text}
			<div class="mt-2 flex items-center gap-2 text-xs">
				{#if embed?.footer.icon_url}
					<img
						src={embed?.footer.icon_url}
						alt="footer icon"
						class="h-5 w-5 rounded-full object-cover"
					/>
				{/if}
				<span>{embed?.footer.text}</span>
			</div>
		{/if}
	</span>
	<span>
		{#if embed?.thumbnail?.url}
			<img
				src={embed?.thumbnail.url}
				alt="thumbnail"
				class="max-h-20 max-w-20 justify-self-end rounded-md object-cover"
			/>
		{/if}
	</span>
    </div>
</Card>
