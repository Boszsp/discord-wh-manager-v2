<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Button } from '$lib/components/ui/button';
	import { cn, type WithElementRef } from '$lib/utils';
	import type { HTMLFormAttributes } from 'svelte/elements';
	import type { SuperForm } from 'sveltekit-superforms';
	import type { templateShemaType } from '$lib/schema/templateShema';

	let {
		ref = $bindable(null),
		class: className,
		form,
		...restProps
	}: WithElementRef<HTMLFormAttributes> & {
		form: SuperForm<templateShemaType, any>;
	} = $props();

	const { form: formData, errors, enhance } = form;
</script>

<form
	class={cn('flex flex-col gap-6', className)}
	bind:this={ref}
	{...restProps}
	method="POST"
	use:enhance
>
	<Form.Field {form} name="name">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Template Name</Form.Label>
				<Input {...props} bind:value={$formData.name} placeholder="My Template" />
			{/snippet}
		</Form.Control>
		<Form.Description>A name to identify your template</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="content">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Template Content</Form.Label>
				<Textarea
					{...props}
					bind:value={$formData.content}
					placeholder="# Hello {name}!&#10;&#10;This is a template with variable placeholders.&#10;You can use any variable names."
					rows={10}
				/>
			{/snippet}
		</Form.Control>
		<Form.Description>
			Use curly braces to define variables. Example: Hello {name}!
		</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<div class="flex justify-end gap-4">
		<Button type="reset" variant="outline">Reset</Button>
		<Button type="submit">Save Template</Button>
	</div>
</form>
