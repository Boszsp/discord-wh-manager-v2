<script lang="ts">
	import type { SuperForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import type {
		embedsPartialSchemaType,
		embedsSchemaType,
		hookJsonPartialSchemaType
	} from '$lib/schema/webhookContentSchema';
	import { Button } from '$lib/components/ui/button';
	import { z } from 'zod';
	import { Input } from '$lib/components/ui/input';
	import * as Accordion from '$lib/components/ui/accordion';
	import ChannelFormEmbedFields from './channel-form-embed-fields.svelte';
	import { Card } from '$lib/components/ui/card';
	import { toHex } from '$lib/utilsFn/string';
	import { colorCodeToInteger } from '$lib/utilsFn/color';
	import { Textarea } from '$lib/components/ui/textarea';
	import { ArrowBigDownIcon, ArrowBigUpIcon, Trash2Icon } from 'lucide-svelte';

	let {
		form
	}: {
		form: SuperForm<hookJsonPartialSchemaType, any>;
	} = $props();
	const { form: formData } = form;

	function addEmbed() {
		const newEmbed: embedsSchemaType = {
			title: '',
			description: '',
			color: 5858545,
			url: '',
			author: {
				name: '',
				url: '',
				icon_url: ''
			},
			footer: {
				text: '',
				icon_url: ''
			},
			thumbnail: {
				url: ''
			},
			image: {
				url: ''
			},
			fields: [],
			avatar_url: ''
		};
		let newEmbeds: embedsSchemaType[] = [];
		if ($formData.embeds) {
			newEmbeds = newEmbeds.concat($formData.embeds);
		}

		newEmbeds.push(newEmbed);
		//console.log(newEmbeds, newEmbed);
		$formData.embeds = newEmbeds;
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
		<p class="">Embeds</p>
		<Button onclick={addEmbed} variant="outline" type="button">Add Embed</Button>
	</div>
	<Accordion.Root type="multiple" class="flex w-full flex-col gap-2">
		{#if $formData.embeds}
			{#each $formData.embeds as embed, i ('embed-' + i)}
				<Card class="overflow-hidden p-0 px-2">
					<Accordion.Item value={'embed-' + i}>
						<Accordion.Trigger class="mx-4 hover:no-underline">
							<div class="flex w-full items-center justify-between">
								<p>Embed {i + 1}</p>
								<div class="inline-flex gap-2">
									<Button
										onclick={(e) => {
											e.stopPropagation();
											moveEmbedUp(i);
										}}
										type="button"
										variant="outline"
										size="sm"
										class="h-fit p-1 text-xs"
										disabled={i === 0}
									>
										<ArrowBigUpIcon />
									</Button>
									<Button
										onclick={(e) => {
											e.stopPropagation();
											moveEmbedDown(i);
										}}
										type="button"
										variant="outline"
										size="sm"
										class="h-fit p-1 text-xs"
										disabled={i === ($formData.embeds?.length || 0) - 1}
									>
										<ArrowBigDownIcon />
									</Button>
									<Button
										onclick={(e) => {
											e.stopPropagation();
											removeEmbed(i);
										}}
										type="button"
										variant="destructive"
										class="h-fit p-1 text-xs"
										size="sm"
									>
										<Trash2Icon />
									</Button>
								</div>
							</div>
						</Accordion.Trigger>
						<Accordion.Content class="px-4">
							<div>
								<Accordion.Root type="multiple" class="w-full">
									<Accordion.Item value="body">
										<Accordion.Trigger>Body</Accordion.Trigger>
										<Accordion.Content>
											<div>
												<Form.Field {form} name={`embeds[${i}].title`}>
													<Form.Control>
														{#snippet children({ props })}
															<Form.Label
																><span class="grow">Title</span><span
																	class="text-sm font-light text-muted-foreground"
																	>{embed?.title?.length ?? 0}/256</span
																></Form.Label
															>
															<Input {...props} bind:value={embed.title} />
														{/snippet}
													</Form.Control>
													<Form.FieldErrors />
												</Form.Field>
												<Form.Field {form} name={`embeds[${i}].description`}>
													<Form.Control>
														{#snippet children({ props })}
															<Form.Label
																><span class="grow">Description</span><span
																	class="text-sm font-light text-muted-foreground"
																	>{embed.description?.length ?? 0}/4096</span
																></Form.Label
															>
															<Textarea {...props} bind:value={embed.description} class="h-32" />
														{/snippet}
													</Form.Control>
													<Form.FieldErrors />
												</Form.Field>
												<div class="inline-flex w-full gap-4">
													<Form.Field {form} name={`embeds[${i}].color`} class="w-16">
														<Form.Control>
															{#snippet children({ props })}
																<Form.Label>Color</Form.Label>
																<Input
																	{...props}
																	type="color"
																	value={toHex(embed.color)}
																	oninput={(e) =>
																		(embed.color =
																			colorCodeToInteger(e?.currentTarget?.value) || 0)}
																/>
															{/snippet}
														</Form.Control>
														<Form.FieldErrors />
													</Form.Field>
													<Form.Field {form} name={`embeds[${i}].url`} class="grow">
														<Form.Control>
															{#snippet children({ props })}
																<Form.Label>URL</Form.Label>
																<Input {...props} bind:value={embed.url} />
															{/snippet}
														</Form.Control>
														<Form.FieldErrors />
													</Form.Field>
												</div>
											</div>
										</Accordion.Content>
									</Accordion.Item>
									{#if embed && embed.author && embed.author != undefined}
										<Accordion.Item value="author">
											<Accordion.Trigger>Author</Accordion.Trigger>
											<Accordion.Content>
												<Form.Field {form} name={`embeds[${i}].author.name`}>
													<Form.Control>
														{#snippet children({ props })}
															<Form.Label
																><span class="grow">Name</span><span
																	class="text-sm font-light text-muted-foreground"
																	>{embed?.author?.name?.length ?? 0}/256</span
																></Form.Label
															>
															<Input {...props} bind:value={embed.author.name} />
														{/snippet}
													</Form.Control>
													<Form.FieldErrors />
												</Form.Field>
												<div class="inline-flex gap-4">
													<Form.Field {form} name={`embeds[${i}].author.url`} class="flex-1">
														<Form.Control>
															{#snippet children({ props })}
																<Form.Label>URL</Form.Label>
																<Input {...props} bind:value={embed.author.url} />
															{/snippet}
														</Form.Control>
														<Form.FieldErrors />
													</Form.Field>
													<Form.Field {form} name={`embeds[${i}].author.icon_url`} class="flex-1">
														<Form.Control>
															{#snippet children({ props })}
																<Form.Label>Icon URL</Form.Label>
																<Input {...props} bind:value={embed.author.icon_url} />
															{/snippet}
														</Form.Control>
														<Form.FieldErrors />
													</Form.Field>
												</div>
											</Accordion.Content>
										</Accordion.Item>
									{/if}
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
									<Accordion.Item value="fields">
										<Accordion.Trigger>Fields</Accordion.Trigger>
										<Accordion.Content>
											<ChannelFormEmbedFields {form} embedIndex={i} />
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

									<Accordion.Item value="footer">
										<Accordion.Trigger>Footer</Accordion.Trigger>
										<Accordion.Content>
											<Form.Field {form} name={`embeds[${i}].footer.text`}>
												<Form.Control>
													{#snippet children({ props })}
														<Form.Label
															><span class="grow">Text</span><span
																class="text-sm font-light text-muted-foreground"
																>{embed?.footer?.text?.length ?? 0}/2048</span
															></Form.Label
														>
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
								</Accordion.Root>
							</div>
						</Accordion.Content>
					</Accordion.Item>
				</Card>
			{/each}
		{/if}
	</Accordion.Root>
</div>
