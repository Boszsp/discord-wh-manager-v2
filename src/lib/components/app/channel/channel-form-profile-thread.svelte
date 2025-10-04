<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import type { ClassValue } from 'svelte/elements';
	import type { SuperForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import type { hookJsonPartialSchemaType } from '$lib/schema/webhookContentSchema';
	import * as Accordion from '$lib/components/ui/accordion';
	import ChannelFormEmbeds from './channel-form-embeds.svelte';
	import { Textarea } from '$lib/components/ui/textarea';
		let {
		class: className,
        form
	}:  {
        class?:ClassValue,
		form: SuperForm<hookJsonPartialSchemaType, any>;
	} = $props();
	const { form: formData } = form;
</script>

<Accordion.Root type="multiple" class={className}>
		<Accordion.Item value="item-1">
			<Accordion.Trigger>Profile</Accordion.Trigger>
			<Accordion.Content>
				<div class="grid grid-cols-2 gap-4">
					<Form.Field {form} name="username">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label class="inline-flex w-full justify-between"
									><span class="w-full">Username</span><span
										class="text-sm font-light text-muted-foreground"
										>{$formData.username?.length}/80</span
									></Form.Label
								>
								<Input {...props} bind:value={$formData.username} />
							{/snippet}
						</Form.Control>
						<Form.Description />
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="avatar_url">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label class="inline-flex w-full justify-between">Avatar URL</Form.Label>
								<Input {...props} bind:value={$formData.avatar_url} />
							{/snippet}
						</Form.Control>
						<Form.Description />
						<Form.FieldErrors />
					</Form.Field>
				</div>
			</Accordion.Content>
		</Accordion.Item>
		<Accordion.Item value="item-2">
			<Accordion.Trigger>Content</Accordion.Trigger>
			<Accordion.Content>
				<Form.Field {form} name="content">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label class="inline-flex w-full justify-between"
								><span class="w-full">Content</span><span
									class="text-sm font-light text-muted-foreground"
									>{$formData.content?.length}/2000</span
								></Form.Label
							>
							<Textarea {...props} bind:value={$formData.content} class="h-32" />
						{/snippet}
					</Form.Control>
					<Form.Description />
					<Form.FieldErrors />
				</Form.Field>
			</Accordion.Content>
		</Accordion.Item>
		<Accordion.Item value="item-3">
			<Accordion.Trigger>Embeds</Accordion.Trigger>
			<Accordion.Content>
				<ChannelFormEmbeds {form} />
			</Accordion.Content>
		</Accordion.Item>
		<Accordion.Item value="item-4">
			<Accordion.Trigger>Thread</Accordion.Trigger>
			<Accordion.Content class="flex flex-col gap-4 text-balance">
				<Form.Field {form} name="thread_name">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label class="inline-flex w-full justify-between"
								><span class="w-full">Thread Name</span><span
									class="text-sm font-light text-muted-foreground"
									>{$formData.thread_name?.length}/100</span
								></Form.Label
							>
							<Input {...props} bind:value={$formData.thread_name} />
						{/snippet}
					</Form.Control>
					<Form.Description />
					<Form.FieldErrors />
				</Form.Field>
			</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>