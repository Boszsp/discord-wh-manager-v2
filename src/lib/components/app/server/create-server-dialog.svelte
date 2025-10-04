<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import Label from '$lib/components/ui/label/label.svelte';
	import { createEventDispatcher } from 'svelte';
	import { PlusIcon } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import { serverSchema } from '$lib/schema/serverSchema';
	import { superForm } from 'sveltekit-superforms/client';
	import * as Form from '$lib/components/ui/form';
	import { zod4 } from 'sveltekit-superforms/adapters';

	const form = superForm(
		{ name: '' },
		{
			validators: zod4(serverSchema)
		}
	);

	const { form: formData, errors, enhance } = form;

	let open = $state(false);

	const dispatch = createEventDispatcher();

	function createServer() {
		if (!$formData.name || $errors.name) return;
		dispatch('createServer', { name: $formData.name });
		$formData.name = '';
		open = false;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={cn(buttonVariants({ size: 'sm' }), 'p-0')}>
		<PlusIcon />
		Create Server
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Create New Server</Dialog.Title>
		</Dialog.Header>
		<form method="POST" use:enhance>
			<Form.Field {form} name="name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Name</Form.Label>
						<Input
							{...props}
							bind:value={$formData.name}
							onkeydown={(e) => e.key === 'Enter' && createServer()}
							placeholder="server name"
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</form>
		<Dialog.Footer>
			<Button onclick={createServer}>Create</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
