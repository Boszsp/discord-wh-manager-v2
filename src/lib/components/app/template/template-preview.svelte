<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import type { templateShemaType } from '$lib/schema/templateShema';
	import { RefreshCcw } from 'lucide-svelte';
	import { highlightCode } from '$lib/utilsFn/string';
	import { onMount } from 'svelte';
	import Preview from '$lib/components/app/preview/preview.svelte';
	import {
		hookJsonPartial,
		type hookJsonPartialSchemaType
	} from '$lib/schema/webhookContentSchema';

	let {
		template
	}: {
		template: templateShemaType;
	} = $props();

	let variables = $state<Record<string, string>>({});
	let preview = $state(template.content);
	let previewHTML = $state('');
	let previewObj = $state<hookJsonPartialSchemaType>({});

	onMount(async () => {
		previewHTML = await highlightCode(preview, 'json');
		try {
			previewObj = hookJsonPartial.parse(JSON.parse(template.content));
		} catch (e) {
			console.error(e);
			previewObj = { content: 'Invalid JSON' };
		}
	});
</script>

<Card>
	<CardHeader>
		<div class="flex items-center justify-between">
			<div>
				<CardTitle>{template.name}</CardTitle>
				<CardDescription>Fill in the variables to preview the template</CardDescription>
			</div>
			<Button
				variant="outline"
				size="icon"
				onclick={() => {
					variables = Object.fromEntries(Object.keys(variables).map((key) => [key, '']));
				}}
			>
				<RefreshCcw class="size-4" />
			</Button>
		</div>
	</CardHeader>
	<CardContent>
		<div class="inline-flex w-full overflow-hidden">
			<span class="flex-1 rounded-md px-4">
				{#if previewObj && previewObj?.content}
					<Preview content={previewObj} />
				{/if}
			</span>
			<span class="relative flex-1 rounded-md bg-[#22272e] p-4">
				{#await highlightCode(preview, 'json')}
					<p class="text-transparent">Processing...</p>
				{:then res}
					{@html res}
				{/await}

				<textarea
					class="absolute inset-0 h-full w-full resize-none border-none bg-transparent focus:outline-none text-foreground/20 p-4 font-mono"
					bind:value={preview}
				></textarea>
			</span>
		</div>
	</CardContent>
</Card>
