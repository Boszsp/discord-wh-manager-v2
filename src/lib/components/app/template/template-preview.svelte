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
	import type { TemplateSchemaType } from '$lib/schema/templateSchema';
	import { Save, SquarePenIcon, TrashIcon } from 'lucide-svelte';
	import { highlightCode } from '$lib/utilsFn/string';
	import { onMount } from 'svelte';
	import Preview from '$lib/components/app/preview/preview.svelte';
	import { type hookJsonPartialSchemaType } from '$lib/schema/webhookContentSchema';
	import { templateStore } from '$lib/store/template.svelte';
	import { consola } from 'consola';
	import TextareaJson from '../form/textarea-json.svelte';
	import type { ClassValue } from 'svelte/elements';
	import { cn } from '$lib/utils';
	import { safePareseTemplateString } from '$lib/utilsFn/template';

	let {
		template,
		class: className,
		onEditTemplate
	}: {
		template: TemplateSchemaType;
		class?: ClassValue;
		onEditTemplate?:(templateId: string, template: TemplateSchemaType) => void;
		
	} = $props();
	let isEditing = $state(false);
	let newName = $state('');
	let preview = $state(template.content);
	let previewHTML = $state(template.name || "");
	let previewObj = $state<hookJsonPartialSchemaType>({});

	onMount(async () => {
		previewHTML = await highlightCode(preview, 'json');
		try {
			previewObj = safePareseTemplateString(template.content) as hookJsonPartialSchemaType;
		} catch (e) {
			consola.error(e);
			previewObj = { content: 'Invalid JSON' };
		}
	});

	function onEdit(){
		newName = template.name;
		isEditing = true;
	}
	function save() {
		//console.log(template.id)
		if(template.id && onEditTemplate)
		onEditTemplate(template.id,{ name: newName, content: template.content })
		templateStore.updateTemplate({ ...template, name: newName });
		isEditing = false;
	}
</script>

<Card class={cn('border-0', className)}>
	<CardHeader>
		<div class="flex h-fit items-start justify-between gap-2">
			<div class="h-fit w-full">
				{#if isEditing}
					<div class="flex items-center gap-2">
						<Input class="w-full" bind:value={newName} />
						<Button variant="outline" size="icon" onclick={save}>
							<Save class="size-4" />
						</Button>
					</div>
				{:else}
					<div class="flex items-center gap-2">
						<CardTitle>{template.name}</CardTitle>
					</div>
				{/if}
				<CardDescription>Fill in the variables to preview the template</CardDescription>
			</div>
			<div class="flex items-center gap-2">
				{#if !isEditing}
				<Button
					variant="outline"
					size="icon"
					onclick={onEdit}
				>
					<SquarePenIcon class="size-4" />
				</Button>
				{/if}
				<Button variant="destructive" size="icon" onclick={() => {}}>
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
			<span class="relative flex-1">
				<TextareaJson class={isEditing ? "border" : ""} bind:value={preview} readonly={!isEditing} />
			</span>
		</div>
	</CardContent>
</Card>
