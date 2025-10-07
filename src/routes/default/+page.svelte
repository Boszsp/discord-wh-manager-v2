<script lang="ts">
	import ChannelContainer from '$lib/components/app/container/channel-container.svelte';
	import ChannelForm from '$lib/components/app/channel/channel-form.svelte';
	import {
		hookJsonPartial,
		urlSchema,
		type hookJsonPartialSchemaType
	} from '$lib/schema/webhookContentSchema';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms/client';
	import Preview from '$lib/components/app/preview/preview.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import * as Resizable from '$lib/components/ui/resizable';
	import * as Form from '$lib/components/ui/form';
	import { cleanUpBlank, sendToWebhook } from '$lib/utilsFn/webhook.js';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import ChannelFile from '$lib/components/app/channel/channel-file.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { toast } from 'svelte-sonner';
	import { z } from 'zod';
	import {
		Card,
		CardHeader,
		CardTitle,
		CardDescription,
		CardContent,
		CardFooter
	} from '$lib/components/ui/card';
	import DashboardContainer from '$lib/components/app/container/dashboard-container.svelte';
	import { parseBase64ToJson, toBase64Optimize } from '$lib/utilsFn/string.js';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import type { PageProps } from './$types';
	import { onMount } from 'svelte';
	import ImagePopupShow from '$lib/components/app/preview/image-popup-show.svelte';
	import TextareaJson from '$lib/components/app/form/textarea-json.svelte';

	const { data }: PageProps = $props();

	const form = superForm(data.formData as hookJsonPartialSchemaType, {
		dataType: 'json',
		validators: zod4(hookJsonPartial),
		validationMethod: 'oninput'
	});

	const { form: formData, enhance } = form;

	const whForm = superForm(
		{ url: '' },
		{
			validators: zod4(z.object({ url: urlSchema })),
			dataType: 'json',
			validationMethod: 'oninput'
		}
	);

	const { form: whData, enhance: whEnhance, validateForm: whValidate, errors: whErrors } = whForm;

	let files: File[] = $state([]);

	const isMoble = new IsMobile();

	async function onSm() {
		const valid = await whValidate();
		if (!valid) {
			if ($whErrors.url) toast.error($whErrors.url[0]);
			return;
		}
		const result = await sendToWebhook($whData.url, cleanUpBlank($formData), files);
		if (result) {
			toast.success('Message sent successfully');
		} else {
			toast.error('Failed to send message');
		}
	}
	async function updateSearchParam() {
		try {
			page.url.searchParams.set('data', await toBase64Optimize(JSON.stringify($formData)));
			goto(page.url.toString(), {
				keepFocus: true,
				replaceState: true,
				invalidateAll: false
			});
		} catch (e) {
			console.error(e);
		}
	}

	onMount(() => {
		formData.subscribe(() => {
			updateSearchParam();
		});
	});
</script>

<ImagePopupShow />
<DashboardContainer leftWidth={0} rightWidth={100} class="bg-background">
	<Resizable.PaneGroup
		direction={isMoble.current ? 'vertical' : 'horizontal'}
		class="overflow-hidden bg-background"
	>
		<Resizable.Pane defaultSize={40} class="w-fit">
			<ScrollArea orientation="both" class="h-full w-full overflow-hidden text-wrap  break-all">
				<div class="p-4">
					<h3 class="mb-4 text-lg font-medium">Preview</h3>
					<div>
						<Preview content={$formData} {files} />
						<Separator class="my-8" />
						<TextareaJson value={JSON.stringify($formData, null, 2)} class="mt-4" />
					</div>
				</div>
			</ScrollArea>
		</Resizable.Pane>
		<Resizable.Handle withHandle />
		<Resizable.Pane defaultSize={60} class="overflow-hidden md:w-fit">
			<ScrollArea class="h-full w-full overflow-hidden">
				<div class="w-full overflow-hidden p-4">
					<h3 class="mb-2 text-lg font-medium">Sent To</h3>
					<Card class="bg-indigo-600  bg-[url('/banner-1.png')]">
						<CardHeader>
							<CardTitle>Webhook URL</CardTitle>
							<CardDescription>Please provide a valid Discord webhook URL.</CardDescription>
						</CardHeader>
						<CardContent>
							<Form.Field form={whForm} name="url">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label>Webhook URL</Form.Label>
										<Input
											{...props}
											name="url"
											bind:value={$whData.url}
											placeholder="https://..."
										/>
									{/snippet}
								</Form.Control>
								<Form.Description />
								<Form.FieldErrors />
							</Form.Field>
						</CardContent>
						<CardFooter>
							<Button class="ml-auto" onclick={onSm}>Sent</Button>
						</CardFooter>
					</Card>
					<Separator class="my-4" />
					<ChannelFile bind:files />
					<Separator class="mt-8 mb-4" />
					<ChannelForm {form} />
				</div>
			</ScrollArea>
		</Resizable.Pane>
	</Resizable.PaneGroup>
</DashboardContainer>
