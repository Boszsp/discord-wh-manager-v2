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
	import { RefreshCcw, Save, Pencil, Check, TrashIcon } from 'lucide-svelte';
	import { highlightCode } from '$lib/utilsFn/string';
	import { onMount } from 'svelte';
	import Preview from '$lib/components/app/preview/preview.svelte';
	import {
		hookJsonPartial,
		type hookJsonPartialSchemaType
	} from '$lib/schema/webhookContentSchema';
	import { templateStore } from '$lib/store/template.svelte';
	import {consola} from "consola";
	import TextareaJson from '../form/textarea-json.svelte';


	let {
		template
	}: {
		template: templateShemaType;
	} = $props();

	let isEditingName = $state(false);
	let newName = $state('');
	let variables = $state<Record<string, string>>({});
	let preview = $state(template.content);
	let previewHTML = $state('');
	let previewObj = $state<hookJsonPartialSchemaType>({});

	onMount(async () => {
		previewHTML = await highlightCode(preview, 'json');
		try {
			previewObj = hookJsonPartial.parse(JSON.parse(template.content));
		} catch (e) {
			consola.error(e);
			previewObj = { content: 'Invalid JSON' };
		}
	});

	function saveName() {
		templateStore.updateTemplate({ ...template, name: newName });
		isEditingName = false;
	}
</script>

<Card>
	<CardHeader>
		<div class="flex items-center justify-between">
			<div>
				{#if isEditingName}
					<div class="flex items-center gap-2">
						<Input bind:value={newName} />
						<Button variant="outline" size="icon" onclick={saveName}>
							<Check class="size-4" />
						</Button>
					</div>
				{:else}
					<div class="flex items-center gap-2">
						<CardTitle>{template.name}</CardTitle>
						<Button
							variant="ghost"
							size="sm"
							class="p-1 h-fit"
							onclick={() => {
								isEditingName = true;
							}}
						>
							<Pencil class="size-4" />
						</Button>
					</div>
				{/if}
				<CardDescription>Fill in the variables to preview the template</CardDescription>
			</div>
			<div class="flex items-center gap-2">
				<Button
					variant="outline"
					size="icon"
					onclick={() => {
						templateStore.updateTemplate({ ...template, content: preview });
					}}
				>
					<Save class="size-4" />
				</Button>
				<Button
					variant="outline"
					size="icon"
					onclick={() => {
						variables = Object.fromEntries(Object.keys(variables).map((key) => [key, '']));
					}}
				>
					<RefreshCcw class="size-4" />
				</Button>
				<Button
					variant="destructive"
					size="icon"
					onclick={() => {
					}}
				>
					<TrashIcon class="size-4" />
				</Button>
			</div>
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
				<TextareaJson bind:value={preview}  />
			</span>
		</div>
	</CardContent>
</Card>
