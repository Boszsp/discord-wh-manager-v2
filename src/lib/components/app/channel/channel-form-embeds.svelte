<script lang="ts">
	import type { SuperForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import type { embedsSchemaType, hookJsonPartialSchemaType } from '$lib/schema/webhookContentSchema';
	import { Button } from '$lib/components/ui/button';
	import { z } from 'zod';
	import { Input } from '$lib/components/ui/input';
	import * as Accordion from '$lib/components/ui/accordion';
	import ChannelFormEmbedFields from './channel-form-embed-fields.svelte';

	let {
		form
	}: {
		form: SuperForm<hookJsonPartialSchemaType, any>;
	} = $props();
	const { form: formData } = form;

	function addEmbed() {
		const newEmbed = {
			title: 'New Embed',
			description: 'New Description',
            color:0,
            url:"",
            author:{
                name:"",
                url:"",
                icon_url:""
            },
            footer:{
                text:"",
                icon_url:""
            },
            thumbnail:{
                url:""
            },
            image:{
                url:""
            },
            fields:[]
		};
		$formData.embeds = [...($formData.embeds || []), newEmbed] as embedsSchemaType[];
	}

	function removeEmbed(index: number) {
		$formData.embeds = $formData.embeds?.filter((_, i) => i !== index);
	}

	function moveEmbedUp(index: number) {
		if (index === 0) return;
		const embeds = $formData.embeds || [];
		const embed = embeds[index];
		embeds[index] = embeds[index - 1];
		embeds[index - 1] = embed;
		$formData.embeds = embeds;
	}

	function moveEmbedDown(index: number) {
		const embeds = $formData.embeds || [];
		if (index === embeds.length - 1) return;
		const embed = embeds[index];
		embeds[index] = embeds[index + 1];
		embeds[index + 1] = embed;
		$formData.embeds = embeds;
	}
</script>

<div class="flex flex-col gap-4">
	<div class="flex items-center justify-between">
		<h3 class="text-lg font-medium">Embeds</h3>
		<Button onclick={addEmbed} type="button">Add Embed</Button>
	</div>
	{#if $formData.embeds}
		{#each $formData.embeds as embed, i}
			<div class="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
				<div class="flex items-center justify-between">
					<p class="font-semibold">Embed {i + 1}</p>
					<div class="flex gap-2">
						<Button onclick={() => moveEmbedUp(i)} type="button" size="sm" disabled={i === 0}>Up</Button>
						<Button onclick={() => moveEmbedDown(i)} type="button" size="sm" disabled={i === ($formData.embeds?.length || 0) - 1}>Down</Button>
						<Button onclick={() => removeEmbed(i)} type="button" variant="destructive" size="sm">Remove</Button>
					</div>
				</div>
				<div class="grid grid-cols-2 gap-4 py-4">
					<Form.Field {form} name={`embeds[${i}].title`}>
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Title</Form.Label>
								<Input {...props} bind:value={embed.title} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name={`embeds[${i}].description`}>
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Description</Form.Label>
								<Input {...props} bind:value={embed.description} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name={`embeds[${i}].color`}>
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Color</Form.Label>
								<Input {...props} type="color" bind:value={embed.color} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name={`embeds[${i}].url`}>
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>URL</Form.Label>
								<Input {...props} bind:value={embed.url} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
				<div class="border-t pt-4">
					<Accordion.Root type="multiple" class="w-full">
						<Accordion.Item value="author">
							<Accordion.Trigger>Author</Accordion.Trigger>
							<Accordion.Content>
								<Form.Field {form} name={`embeds[${i}].author.name`}>
									<Form.Control>
										{#snippet children({ props })}
											<Form.Label>Name</Form.Label>
											<Input {...props} bind:value={embed.author.name} />
										{/snippet}
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
								<Form.Field {form} name={`embeds[${i}].author.url`}>
									<Form.Control>
										{#snippet children({ props })}
											<Form.Label>URL</Form.Label>
											<Input {...props} bind:value={embed.author.url} />
										{/snippet}
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
								<Form.Field {form} name={`embeds[${i}].author.icon_url`}>
									<Form.Control>
										{#snippet children({ props })}
											<Form.Label>Icon URL</Form.Label>
											<Input {...props} bind:value={embed.author.icon_url} />
										{/snippet}
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
							</Accordion.Content>
						</Accordion.Item>
						<Accordion.Item value="footer">
							<Accordion.Trigger>Footer</Accordion.Trigger>
							<Accordion.Content>
								<Form.Field {form} name={`embeds[${i}].footer.text`}>
									<Form.Control>
										{#snippet children({ props })}
											<Form.Label>Text</Form.Label>
											<Input {...props} bind:value={embed.footer.text} />
										{/snippet}
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
								<Form.Field {form} name={`embeds[${i}].footer.icon_url`}>
									<Form.Control>
										{#snippet children({ props })}
											<Form.Label>Icon URL</Form.Label>
											<Input {...props} bind:value={embed.footer.icon_url} />
										{/snippet}
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
							</Accordion.Content>
						</Accordion.Item>
						<Accordion.Item value="thumbnail">
							<Accordion.Trigger>Thumbnail</Accordion.Trigger>
							<Accordion.Content>
								<Form.Field {form} name={`embeds[${i}].thumbnail.url`}>
									<Form.Control>
										{#snippet children({ props })}
											<Form.Label>URL</Form.Label>
											<Input {...props} bind:value={embed.thumbnail.url} />
										{/snippet}
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
							</Accordion.Content>
						</Accordion.Item>
						<Accordion.Item value="image">
							<Accordion.Trigger>Image</Accordion.Trigger>
							<Accordion.Content>
								<Form.Field {form} name={`embeds[${i}].image.url`}>
									<Form.Control>
										{#snippet children({ props })}
											<Form.Label>URL</Form.Label>
											<Input {...props} bind:value={embed.image.url} />
										{/snippet}
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
							</Accordion.Content>
						</Accordion.Item>
						<Accordion.Item value="fields">
							<Accordion.Trigger>Fields</Accordion.Trigger>
							<Accordion.Content>
								<ChannelFormEmbedFields {form} embedIndex={i} />
							</Accordion.Content>
						</Accordion.Item>
					</Accordion.Root>
				</div>
			</div>
		{/each}
	{/if}
</div>
