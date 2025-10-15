<script lang="ts">
	import ChannelForm from '$lib/components/app/channel/channel-form.svelte';
	import {
		hookJsonFullyPartialSchema,
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
	import { toBase64Optimize } from '$lib/utilsFn/string.js';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import type { PageProps } from './$types';
	import { onMount } from 'svelte';
	import ImagePopupShow from '$lib/components/app/preview/image-popup-show.svelte';
	import TextareaJson from '$lib/components/app/form/textarea-json.svelte';
	import { LoaderCircleIcon } from 'lucide-svelte';
	import FileManipulation from '$lib/components/app/file/file-manipulation.svelte';

	const { data }: PageProps = $props();

	const form = superForm(data.formData as hookJsonPartialSchemaType, {
		dataType: 'json',
		validators: zod4(hookJsonPartial),
		validationMethod: 'oninput',
		onSubmit: (inp) => {
			inp.cancel();
			return false;
		}
	});

	const { form: formData, enhance } = form;

	const whForm = superForm(
		{ url: '' },
		{
			validators: zod4(z.object({ url: urlSchema })),
			dataType: 'json',
			validationMethod: 'oninput',
			onSubmit: (inp) => {
				inp.cancel();
				return false;
			}
		}
	);

	const { form: whData, enhance: whEnhance, validateForm: whValidate, errors: whErrors } = whForm;

	let files: File[] = $state([]);

	const isMoble = new IsMobile();
	let isLoading = $state(false);

	async function onSend() {
		const { success: validForm, error } = hookJsonFullyPartialSchema.safeParse($formData);
		const valid = await whValidate();
		if (!valid) {
			if ($whErrors.url) toast.error($whErrors.url[0]);
			return;
		}
		if (!validForm) {
			if (error) toast.error(error.message);
			return;
		}
		if (
			!(
				$formData?.content ||
				($formData?.embeds && $formData?.embeds?.length > 0) ||
				files?.length > 0
			)
		) {
			toast.warning(
				'Note that when sending a message, you must provide a value for at least one of content, embeds, components, file, or poll.'
			);
			return;
		}
		isLoading = true;
		const result = sendToWebhook(
			$whData.url,
			cleanUpBlank($formData),
			files,
			(mss, type: 'error' | 'success' = 'success') => {
				if (type === 'error') toast.error(mss);
				else toast.success(mss);
			}
		);
		toast.promise(result);
		const resultAwaited = await result;
		isLoading = false;
		if (
			(resultAwaited?.payloadRes || resultAwaited?.filesRes?.length > 0) &&
			!(
				resultAwaited?.payloadRes instanceof Error ||
				resultAwaited?.filesRes?.some((v: any) => v instanceof Error)
			)
		) {
			toast.success('All Message sent successfully');
		} else {
			console.error(resultAwaited?.payloadRes, resultAwaited?.filesRes);

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
							<Button type="button" disabled={isLoading} class="ml-auto" onclick={onSend}>
								{#if isLoading}
									<LoaderCircleIcon class="animate-spin" />
									Please wait
								{:else}
									Sent
								{/if}
							</Button>
						</CardFooter>
					</Card>
					<FileManipulation class="mt-4" bind:files />
					<Separator class="my-4" />
					<ChannelFile bind:files />
					<Separator class="mt-8 mb-4" />
					<ChannelForm {form} />
				</div>
			</ScrollArea>
		</Resizable.Pane>
	</Resizable.PaneGroup>
</DashboardContainer>
