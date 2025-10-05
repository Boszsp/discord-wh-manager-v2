<script lang="ts">
	import type { SuperForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import type { hookJsonPartialSchemaType } from '$lib/schema/webhookContentSchema';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Accordion from '$lib/components/ui/accordion';
	import { ArrowBigDownIcon, ArrowBigUpIcon, Trash2Icon } from 'lucide-svelte';

	let {
		form,
		embedIndex
	}: {
		form: SuperForm<hookJsonPartialSchemaType, any>;
		embedIndex: number;
	} = $props();
	const { form: formData } = form;

	function addField() {
		const newField = {
			name: '',
			value: '',
			inline: false
		};
		const embeds = $formData.embeds || [];
		embeds[embedIndex].fields = [...(embeds[embedIndex].fields || []), newField];
		$formData.embeds = embeds;
	}

	function removeField(fieldIndex: number) {
		const embeds = $formData.embeds || [];
		embeds[embedIndex].fields = embeds[embedIndex].fields?.filter((_, i) => i !== fieldIndex);
		$formData.embeds = embeds;
	}

	function moveFieldUp(fieldIndex: number) {
		if (fieldIndex === 0) return;
		const embeds = $formData.embeds || [];
		const fields = embeds[embedIndex].fields || [];
		const field = fields[fieldIndex];
		fields[fieldIndex] = fields[fieldIndex - 1];
		fields[fieldIndex - 1] = field;
		$formData.embeds = embeds;
	}

	function moveFieldDown(fieldIndex: number) {
		const embeds = $formData.embeds || [];
		const fields = embeds[embedIndex].fields || [];
		if (fieldIndex === fields.length - 1) return;
		const field = fields[fieldIndex];
		fields[fieldIndex] = fields[fieldIndex + 1];
		fields[fieldIndex + 1] = field;
		$formData.embeds = embeds;
	}
</script>

<div class="flex flex-col gap-4">
	<div class="flex items-center justify-between">
		<h4 class="text-md font-medium">Fields</h4>
		<Button onclick={addField} class="h-fit p-1 px-2 text-xs" size="sm" type="button"
			>Add Field</Button
		>
	</div>
	<Accordion.Root type="multiple" class="flex w-full flex-col gap-2">
		{#if $formData.embeds?.[embedIndex]?.fields}
			{#each $formData.embeds[embedIndex].fields as field, i (`embed-${embedIndex}-field-${i}`)}
				<div class="rounded-md bg-secondary p-0 text-card-foreground shadow-sm">
					<Accordion.Item value={`field-${i}`}>
						<Accordion.Trigger class="px-4">
							<div class="flex w-full items-center justify-between">
								<p class="font-semibold">Field {i + 1}</p>
								<div class="flex gap-2">
									<Button
										onclick={(e) => {
											e.stopPropagation();
											moveFieldUp(i);
										}}
										type="button"
										size="sm"
										class="h-fit p-1 text-xs"
										variant="outline"
										disabled={i === 0}><ArrowBigUpIcon /></Button
									>
									<Button
										onclick={(e) => {
											e.stopPropagation();
											moveFieldDown(i);
										}}
										type="button"
										size="sm"
										disabled={i === ($formData.embeds?.[embedIndex]?.fields?.length || 0) - 1}
										class="h-fit p-1 text-xs"
										variant="outline"><ArrowBigDownIcon /></Button
									>
									<Button
										onclick={(e) => {
											e.stopPropagation();
											removeField(i);
										}}
										type="button"
										variant="destructive"
										class="h-fit p-1 text-xs"
										size="sm"><Trash2Icon /></Button
									>
								</div>
							</div>
						</Accordion.Trigger>
						<Accordion.Content class="px-4">
							<div class="inline-flex w-full gap-4">
								<Form.Field {form} name={`embeds[${embedIndex}].fields[${i}].name`} class="grow">
									<Form.Control>
										{#snippet children({ props })}
											<Form.Label
												><span class="grow">Name</span><span
													class="text-sm font-light text-muted-foreground"
													>{$formData.embeds?.[embedIndex]?.fields?.[i]?.name?.length}/256</span
												></Form.Label
											>
											<Input {...props} bind:value={field.name} />
										{/snippet}
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
								<Form.Field {form} name={`embeds[${embedIndex}].fields[${i}].inline`} class="mt-12">
									<Form.Control>
										{#snippet children({ props })}
											<div class="flex items-center gap-2">
												<Checkbox {...props} bind:checked={field.inline} class="size-4" />
												<Form.Label>Inline</Form.Label>
											</div>
										{/snippet}
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
							</div>
							<Form.Field {form} name={`embeds[${embedIndex}].fields[${i}].value`}>
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label
											><span class="grow">Value</span><span
												class="text-sm font-light text-muted-foreground"
												>{$formData.embeds?.[embedIndex]?.fields?.[i]?.name?.length}/1024</span
											></Form.Label
										>
										<Textarea class="h-12" {...props} bind:value={field.value} />
									{/snippet}
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						</Accordion.Content>
					</Accordion.Item>
				</div>
			{/each}
		{/if}
	</Accordion.Root>
</div>
