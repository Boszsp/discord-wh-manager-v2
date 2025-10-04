<script lang="ts">
	import type { SuperForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import type { hookJsonPartialSchemaType } from '$lib/schema/webhookContentSchema';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import type { fieldsSchema } from '$lib/schema/webhookContentSchema';
	import { Checkbox } from '$lib/components/ui/checkbox';

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
	<div class="flex items-center justify-between">
		<h4 class="text-md font-medium">Fields</h4>
		<Button onclick={addField} type="button">Add Field</Button>
	</div>
	{#if $formData.embeds?.[embedIndex]?.fields}
		{#each $formData.embeds[embedIndex].fields as field, i (`embed-${embedIndex}-field-${i}`)}
			<div class="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
				<div class="flex items-center justify-between">
					<p class="font-semibold">Field {i + 1}</p>
					<Button onclick={() => removeField(i)} type="button" variant="destructive" size="sm">Remove</Button>
				</div>
				<div class="grid grid-cols-2 gap-4 py-4">
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
					<div class="col-span-2">
						<Form.Field {form} name={`embeds[${embedIndex}].fields[${i}].inline`}>
							<Form.Control>
								{#snippet children({ props })}
									<div class="flex items-center gap-2">
										<Checkbox {...props} bind:checked={field.inline} class="size-4"/>
										<Form.Label>Inline</Form.Label>
									</div>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>
				</div>
			</div>
		{/each}
	{/if}
</div>
