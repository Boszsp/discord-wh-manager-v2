<script lang="ts">
	import type { SuperForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import type { hookJsonPartialSchemaType } from '$lib/schema/webhookContentSchema';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import type { fieldsSchema } from '$lib/schema/webhookContentSchema';

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
			name: 'New Field',
			value: 'New Value',
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
</script>

<div class="flex flex-col gap-4">
	<h4 class="text-md font-medium">Fields</h4>
	{#if $formData.embeds?.[embedIndex]?.fields}
		{#each $formData.embeds[embedIndex].fields as field, i}
			<div class="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
				<div class="flex justify-between">
					<p class="font-semibold">Field {i + 1}</p>
					<Button onclick={() => removeField(i)} type="button" variant="destructive" size="sm">Remove</Button>
				</div>
				<Form.Field {form} name={`embeds[${embedIndex}].fields[${i}].name`}>
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Name</Form.Label>
							<Input {...props} bind:value={field.name} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name={`embeds[${embedIndex}].fields[${i}].value`}>
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Value</Form.Label>
							<Input {...props} bind:value={field.value} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name={`embeds[${embedIndex}].fields[${i}].inline`}>
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Inline</Form.Label>
							<Input type="checkbox" {...props} bind:checked={field.inline} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
		{/each}
	{/if}
	<Button onclick={addField} type="button">Add Field</Button>
</div>
