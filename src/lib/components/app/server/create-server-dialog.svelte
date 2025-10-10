<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { PlusIcon, ServerIcon } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import { serverSchema } from '$lib/schema/serverSchema';
	import { superForm } from 'sveltekit-superforms/client';
	import * as Form from '$lib/components/ui/form';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { convertToFallbackString } from '$lib/utilsFn/string';
	import { DEFAULT_SERVER_BG_COLOR } from '$lib/default';

	let {
		onCreateServer = (detail: { name: string ,color:string}) => {}
	}: { onCreateServer:(detail: { name: string ,color:string}) => void} = $props();

	const form = superForm(
		{ name: '', color: DEFAULT_SERVER_BG_COLOR },
		{
			validators: zod4(serverSchema),
			validationMethod: 'oninput',
			onSubmit: (inp) => {
				inp.cancel();
				return false;
			},

		}
	);

	const { form: formData, errors, enhance,validateForm } = form;

	let open = $state(false);

	async function createServer() {
		const {data} = await validateForm()
		if (!data?.name || $errors.name) return;
		onCreateServer({name:data.name, color:data.color});
		$formData.name = '';
		open = false;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={cn(buttonVariants({ size: 'sm',variant:"outline" }), 'p-0')}>
		<PlusIcon />
		Create Server
	</Dialog.Trigger>
	<Dialog.Content class="w-md">
		<Dialog.Header>
			<Dialog.Title class="mx-auto w-fit">Create New Server</Dialog.Title>
			<Dialog.Description class="mx-auto"
				>The server will use a group of webhooks</Dialog.Description
			>
			<Dialog.Description class="mx-auto">เซิร์ฟเวอร์จะใช้เป็นกลุ่มของเว็บฮุก</Dialog.Description>
		</Dialog.Header>
		<form method="POST" use:enhance>
			<Form.Field {form} name="color" class="pb-8">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label class="mx-auto w-fit">Server Color</Form.Label>
						<div class="relative mx-auto size-24 overflow-hidden rounded-full border border-dashed">
							<Input
								{...props}
								bind:value={$formData.color}
								type="color"
								class="size-full scale-200 bg-transparent opacity-60"
							/>
						</div>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Name</Form.Label>
						<div class="relative">
							<ServerIcon class="absolute top-2.5 left-2.5 size-4" />
							<Input
								{...props}
								bind:value={$formData.name}
								onkeydown={(e) => e.key === 'Enter' && createServer()}
								class="pl-8"
								placeholder="server name"
							/>
						</div>
					{/snippet}
				</Form.Control>
				<Form.Description>
					<code
						class="relative mr-1 rounded bg-muted px-[0.3rem] py-[0.2rem] font-sans text-sm font-semibold"
					>
						{convertToFallbackString($formData.name)}
					</code>will be displayed as the server icon.
				</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
		</form>
		<Dialog.Footer>
			<Button variant="outline" onclick={() => (open = false)}>Cancel</Button>

			<Button onclick={createServer}>Create</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
