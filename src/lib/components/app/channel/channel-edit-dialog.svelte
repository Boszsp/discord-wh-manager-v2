<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { LinkIcon, HashIcon } from 'lucide-svelte';
	import { webhookSchema, type webhookSchemaType } from '$lib/schema/webhookSchema';
	import { superForm } from 'sveltekit-superforms/client';
	import * as Form from '$lib/components/ui/form';
	import { zod4 } from 'sveltekit-superforms/adapters';

	let {
		channel = { name: '', url: '', id: undefined },
		onSaveChannel = (channelId: string, channel: webhookSchemaType) => {},
		triggerType = 'button', // 'button' or 'icon'
		open = $bindable(false)
	}: {
		channel: { name: string; url: string; id?: string | undefined };
		onSaveChannel: (channelId: string, channel: webhookSchemaType) => void;
		triggerType?: 'button' | 'icon';
		open?: boolean;
	} = $props();

	const isEditing = !!channel.id;
	const title = isEditing ? 'Edit Channel' : 'Create Channel';
	const buttonText = isEditing ? 'Update' : 'Create';

	const form = superForm(
		{ name: channel.name, url: channel.url },
		{
			validators: zod4(webhookSchema),
			validationMethod: 'oninput',
			onSubmit: (inp) => {
				inp.cancel();
				return false;
			},
			clearOnSubmit: 'errors'
		}
	);

	const { form: formData, errors, enhance, validateForm } = form;

	async function saveChannel() {
		const {data} = await validateForm();
		if (!data?.name || !data?.url || $errors.name || $errors.url) return;
		onSaveChannel(String(channel?.id), { name: data.name, url: data.url });
		$formData.name = '';
		$formData.url = '';
		open = false;
	}
</script>

<Dialog.Root bind:open>
	<form method="POST" use:enhance>
		<Dialog.Content class="w-md">
			<Dialog.Header>
				<Dialog.Title class="mx-auto w-fit">{title}</Dialog.Title>
				<Dialog.Description class="mx-auto">
					{isEditing ? 'Update the channel information' : 'Add a new channel to your server'}
				</Dialog.Description>
			</Dialog.Header>
			<Form.Field {form} name="name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Name</Form.Label>
						<div class="relative">
							<HashIcon class="absolute top-2.5 left-2.5 size-4" />
							<Input
								{...props}
								bind:value={$formData.name}
								onkeydown={(e) => e.key === 'Enter' && saveChannel()}
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
						<Form.Label>URL</Form.Label>
						<div class="relative">
							<LinkIcon class="absolute top-2.5 left-2.5 size-4" />
							<Input
								{...props}
								bind:value={$formData.url}
								onkeydown={(e) => e.key === 'Enter' && saveChannel()}
								class="pl-8"
								placeholder="https://example.com/webhook"
							/>
						</div>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Dialog.Footer>
				<Button variant="outline" onclick={() => (open = false)}>Cancel</Button>
				<Button onclick={saveChannel}>{buttonText}</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</form>
</Dialog.Root>
