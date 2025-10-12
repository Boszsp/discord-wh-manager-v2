<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { LayoutTemplateIcon } from 'lucide-svelte';
	import type { Snippet } from 'svelte';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import {z} from 'zod';

	let {
		confirmText = 'Create',
		cancelText = 'Cancel',
		onConfirm = () => {},
		templateName = $bindable(''),
		variant = 'default', // 'destructive' or 'default'
		disabled = false,
		open = $bindable(false),
		children
	}: {
		confirmText?: string;
		cancelText?: string;
		onConfirm?: (name?: string) => void;
		templateName?: string;
		variant?: 'destructive' | 'default';
		disabled?: boolean;
		open?: boolean;
		children?: Snippet;
	} = $props();

	
	const form = superForm(
		{ name: '' },
		{
			validators: zod4(z.object({ name: z.string().min(1) })),
			validationMethod: 'oninput',
			onSubmit: (inp) => {
				inp.cancel();
				return false;
			},
		}
	);

    const {form:formData , validateForm} = form
    async function handleConfirm() {
        const {valid,data,errors} = await validateForm()
        if(!valid || errors.name)return
		onConfirm(data.name);
		open = false;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={'m-0 size-fit p-0'} {disabled}>
		{@render children?.()}
	</Dialog.Trigger>
	<Dialog.Content class="w-md">
		<Dialog.Header>
			<Dialog.Title>Confirm Create Template</Dialog.Title>
			<Dialog.Description>
				Are you sure you want to create a new template with previewed data?
			</Dialog.Description>
		</Dialog.Header>
        <Form.Field {form} name="name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Template Name</Form.Label>
						<div class="relative">
			<LayoutTemplateIcon class="absolute top-2.5 left-2.5 size-4" />
							<Input
								{...props}
								bind:value={$formData.name}
								class="pl-8"
								placeholder="template name"
							/>
						</div>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

		<Dialog.Footer>
			<Button variant="outline" onclick={() => (open = false)}>
				{cancelText}
			</Button>
			<Button {variant} onclick={handleConfirm}>
				{confirmText}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
