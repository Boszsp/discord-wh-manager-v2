<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as d from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Hash, CirclePlusIcon, Link2Icon } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import { webhookSchema, type webhookSchemaType } from '$lib/schema/webhookSchema';
	import { superForm } from 'sveltekit-superforms/client';
	import * as Form from '$lib/components/ui/form';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { channelCurId } from '$lib/store/channel.svelte';

	const form = superForm(
		{ name: '', url: '' },
		{
			validators: zod4(webhookSchema),
			validationMethod: 'oninput'
		}
	);

	const { form: formData, errors, enhance, validateForm } = form;

	let open = $state(false);

	let {
		onCreateChannel = async () => {
		
		}
	}: { onCreateChannel?:  (serverId: string, channel: webhookSchemaType) => Promise<void> } = $props();

	async function createChannel() {
		const { data } = await validateForm();
		if (!data.name || !data.url || $errors.name || $errors.url) return;
		onCreateChannel(String($channelCurId?.id), { name: data.name, url: data.url }).then(() => {
			$formData.name = '';
			$formData.url = '';
			open = false;
		});
	}
</script>

<d.Root bind:open>
	<d.Trigger
		class={cn(buttonVariants({ size: 'sm', variant: 'ghost' }), 'w-full justify-start p-0')}
	>
		<CirclePlusIcon />Add Channel
	</d.Trigger>
	<d.Content class="w-md">
		<d.Header>
			<d.Title class="mx-auto w-fit">Create New Channel</d.Title>
			<d.Description class="mx-auto">Create a new webhook channel.</d.Description>
		</d.Header>
		<form method="POST" use:enhance>
			<Form.Field {form} name="name" class="pb-4">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Name</Form.Label>
						<div class="relative">
							<Hash class="absolute top-2.5 left-2.5 size-4" />
							<Input
								{...props}
								bind:value={$formData.name}
								class="pl-8"
								placeholder="channel name"
							/>
						</div>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="url">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Webhook URL</Form.Label>

						<div class="relative">
							<Link2Icon class="absolute top-2.5 left-2.5 size-4" />
							<Input
								{...props}
								bind:value={$formData.url}
								onkeydown={(e) => e.key === 'Enter' && createChannel()}
								placeholder="https://discord.com/api/webhooks/..."
								class="pl-8"
							/>
						</div>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</form>
		<d.Footer>
			<Button variant="outline" onclick={() => (open = false)}>Cancel</Button>
			<Button onclick={createChannel}>Create</Button>
		</d.Footer>
	</d.Content>
</d.Root>
